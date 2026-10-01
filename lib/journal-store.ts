import 'server-only';
import { cache } from 'react';
import { get, put, BlobPreconditionFailedError } from '@vercel/blob';
import { posts as initialPosts } from './posts.generated';
import {
  type Entry,
  JournalError,
  emptyDraft,
  publishedPost,
  slugify,
  validateDraft,
  validateVersion,
} from './journal-model';
import type { Post } from './post-types';

type Journal = { schema: 1; entries: Entry[] };
const storePath = () =>
  process.env.JOURNAL_STORE_PATH ??
  `journal/${process.env.VERCEL_ENV ?? 'development'}.json`;
export const journalStorageConfigured = () =>
  !!process.env.BLOB_READ_WRITE_TOKEN ||
  !!(process.env.BLOB_STORE_ID && process.env.VERCEL_OIDC_TOKEN);

function withBundledEntries(journal: Journal): Journal {
  const ids = new Set(journal.entries.map((entry) => entry.id));
  const additions = initialPosts
    .filter((post) => !post.draft && !ids.has(`initial-${post.slug}`))
    .map((post) => ({
      id: `initial-${post.slug}`,
      slug: post.slug,
      draft: validateDraft(post),
      published: post,
      updatedAt: Date.parse(post.date + 'T00:00:00Z'),
      version: 1,
    }));
  return { schema: 1, entries: [...journal.entries, ...additions] };
}

async function readJournal() {
  if (!journalStorageConfigured())
    return {
      journal: withBundledEntries({ schema: 1, entries: [] }),
      etag: undefined,
    };
  const blob = await get(storePath(), {
    access: 'private',
    useCache: false,
    // Compressed responses have weak ETags, which cannot be used for If-Match.
    headers: { 'accept-encoding': 'identity' },
  });
  if (!blob)
    return {
      journal: withBundledEntries({ schema: 1, entries: [] }),
      etag: undefined,
    };
  if (blob.statusCode !== 200 || !blob.stream)
    throw new Error('The journal could not be read from private storage.');
  const value = (await new Response(blob.stream).json()) as Journal;
  if (value.schema !== 1 || !Array.isArray(value.entries))
    throw new Error('The saved journal has an unsupported format.');
  return { journal: withBundledEntries(value), etag: blob.blob.etag };
}

async function changeJournal<T>(change: (journal: Journal) => T): Promise<T> {
  if (!journalStorageConfigured())
    throw new JournalError(
      'The writing desk has not been connected to storage yet.',
      503,
    );
  const { journal, etag } = await readJournal();
  const result = change(journal);
  try {
    await put(storePath(), JSON.stringify(journal), {
      access: 'private',
      contentType: 'application/json',
      addRandomSuffix: false,
      allowOverwrite: !!etag,
      ifMatch: etag,
      cacheControlMaxAge: 60,
    });
  } catch (error) {
    if (
      error instanceof BlobPreconditionFailedError ||
      (error instanceof Error && /already exists/i.test(error.message))
    )
      throw new JournalError(
        'The journal changed in another tab. Copy your latest text, then reload to continue.',
        409,
      );
    throw error;
  }
  return result;
}

function entryIn(journal: Journal, id: string, version?: number): Entry {
  const entry = journal.entries.find((entry) => entry.id === id);
  if (!entry) throw new JournalError('This post could not be found.', 404);
  if (version !== undefined && version !== entry.version)
    throw new JournalError(
      'This post changed in another tab. Copy your latest text, then reload to continue.',
      409,
    );
  return entry;
}

// Share one storage snapshot between metadata, the article and its next link.
// React's cache lasts for this render; owner reads and writes stay uncached.
export const getPublicPosts = cache(async (): Promise<Post[]> => {
  const { journal } = await readJournal();
  const today = new Date().toISOString().slice(0, 10);
  return journal.entries
    .flatMap((entry) =>
      entry.published && !entry.published.draft && entry.published.date <= today
        ? [entry.published]
        : [],
    )
    .sort(
      (a, b) => b.date.localeCompare(a.date) || a.slug.localeCompare(b.slug),
    );
});
export async function getPublicPost(slug: string) {
  return (await getPublicPosts()).find((post) => post.slug === slug);
}
export async function listEntries(): Promise<Entry[]> {
  return (await readJournal()).journal.entries.sort(
    (a, b) => b.updatedAt - a.updatedAt,
  );
}
export async function getEntry(id: string): Promise<Entry> {
  return entryIn((await readJournal()).journal, id);
}
export async function initializeJournal() {
  // Add new bundled essays without replacing owner edits or restoring withdrawn entries.
  await changeJournal(() => undefined);
}
export async function createEntry(): Promise<Entry> {
  return changeJournal((journal) => {
    const id = crypto.randomUUID();
    const entry: Entry = {
      id,
      slug: `draft-${id}`,
      draft: { ...emptyDraft, tags: [] },
      published: null,
      updatedAt: Date.now(),
      version: 1,
    };
    journal.entries.push(entry);
    return entry;
  });
}
export async function saveEntry(
  id: string,
  input: unknown,
  versionInput: unknown,
): Promise<Entry> {
  const draft = validateDraft(input),
    version = validateVersion(versionInput);
  return changeJournal((journal) => {
    const entry = entryIn(journal, id, version);
    entry.draft = draft;
    entry.updatedAt = Date.now();
    entry.version++;
    return entry;
  });
}
export async function publishEntry(
  id: string,
  input: unknown,
  versionInput: unknown,
): Promise<Entry> {
  const draft = validateDraft(input, true),
    version = validateVersion(versionInput);
  return changeJournal((journal) => {
    const entry = entryIn(journal, id, version);
    let slug = entry.slug;
    if (slug.startsWith('draft-')) {
      const base = slugify(draft.title);
      slug = base;
      for (
        let suffix = 2;
        journal.entries.some((other) => other.id !== id && other.slug === slug);
        suffix++
      )
        slug = `${base}-${suffix}`;
    }
    const date = entry.published?.date ?? new Date().toISOString().slice(0, 10);
    entry.slug = slug;
    entry.draft = draft;
    entry.published = publishedPost(draft, slug, date);
    entry.updatedAt = Date.now();
    entry.version++;
    return entry;
  });
}
export async function unpublishEntry(
  id: string,
  versionInput: unknown,
): Promise<Entry> {
  const version = validateVersion(versionInput);
  return changeJournal((journal) => {
    const entry = entryIn(journal, id, version);
    entry.published = null;
    entry.updatedAt = Date.now();
    entry.version++;
    return entry;
  });
}
