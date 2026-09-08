import { getDb } from '@/db';
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

type Row = {
  id: string;
  slug: string;
  draft_json: string;
  published_json: string | null;
  updated_at: number;
  version: number;
};
const columns = 'id, slug, draft_json, published_json, updated_at, version';
const entryFromRow = (row: Row): Entry => ({
  id: row.id,
  slug: row.slug,
  draft: JSON.parse(row.draft_json),
  published: row.published_json ? JSON.parse(row.published_json) : null,
  updatedAt: row.updated_at,
  version: row.version,
});

export async function getPublicPosts(): Promise<Post[]> {
  const db = getDb();
  // Bundled essays provide the first issue before the owner opens the desk.
  // Once initialized, the database is authoritative, including an empty journal.
  const count = await db
    .prepare('SELECT COUNT(*) AS total FROM journal_entries')
    .first<{ total: number }>();
  if (!count?.total)
    return initialPosts.filter(
      (post) =>
        !post.draft && post.date <= new Date().toISOString().slice(0, 10),
    );
  const result = await db
    .prepare(
      'SELECT published_json FROM journal_entries WHERE published_json IS NOT NULL ORDER BY published_at DESC, created_at DESC, id ASC',
    )
    .all<{ published_json: string }>();
  return result.results.map((row) => JSON.parse(row.published_json) as Post);
}

export async function getPublicPost(slug: string) {
  return (await getPublicPosts()).find((post) => post.slug === slug);
}

export async function listEntries(): Promise<Entry[]> {
  const rows = await getDb()
    .prepare(
      `SELECT ${columns} FROM journal_entries ORDER BY updated_at DESC, id ASC`,
    )
    .all<Row>();
  return rows.results.map(entryFromRow);
}

export async function getEntry(id: string): Promise<Entry> {
  const row = await getDb()
    .prepare(`SELECT ${columns} FROM journal_entries WHERE id = ?`)
    .bind(id)
    .first<Row>();
  if (!row) throw new JournalError('This post could not be found.', 404);
  return entryFromRow(row);
}

export async function initializeJournal() {
  const db = getDb();
  const count = await db
    .prepare('SELECT COUNT(*) AS total FROM journal_entries')
    .first<{ total: number }>();
  if (count?.total) return;
  if (!initialPosts.length) return;
  const now = Date.now();
  await db.batch(
    initialPosts
      .filter((post) => !post.draft)
      .map((post, index) =>
        db
          .prepare(
            'INSERT OR IGNORE INTO journal_entries (id, slug, draft_json, published_json, created_at, updated_at, published_at, version) VALUES (?, ?, ?, ?, ?, ?, ?, 1)',
          )
          .bind(
            `initial-${post.slug}`,
            post.slug,
            JSON.stringify(validateDraft(post)),
            JSON.stringify(post),
            now - index,
            now - index,
            Date.parse(post.date + 'T00:00:00Z'),
          ),
      ),
  );
}

export async function createEntry(): Promise<Entry> {
  await initializeJournal();
  const id = crypto.randomUUID();
  const now = Date.now();
  await getDb()
    .prepare(
      'INSERT INTO journal_entries (id, slug, draft_json, created_at, updated_at, version) VALUES (?, ?, ?, ?, ?, 1)',
    )
    .bind(id, `draft-${id}`, JSON.stringify(emptyDraft), now, now)
    .run();
  return getEntry(id);
}

export async function saveEntry(
  id: string,
  input: unknown,
  versionInput: unknown,
): Promise<Entry> {
  const draft = validateDraft(input);
  const version = validateVersion(versionInput);
  const result = await getDb()
    .prepare(
      'UPDATE journal_entries SET draft_json = ?, updated_at = ?, version = version + 1 WHERE id = ? AND version = ?',
    )
    .bind(JSON.stringify(draft), Date.now(), id, version)
    .run();
  if (!result.meta.changes)
    throw new JournalError(
      'This post changed in another tab. Copy your latest text, then reload to continue.',
      409,
    );
  return getEntry(id);
}

export async function publishEntry(
  id: string,
  input: unknown,
  versionInput: unknown,
): Promise<Entry> {
  const draft = validateDraft(input, true);
  const version = validateVersion(versionInput);
  const current = await getEntry(id);
  if (version !== current.version)
    throw new JournalError(
      'This post changed in another tab. Reload before publishing.',
      409,
    );
  const db = getDb();
  let slug = current.slug;
  if (slug.startsWith('draft-')) {
    const base = slugify(draft.title);
    slug = base;
    for (
      let suffix = 2;
      await db
        .prepare('SELECT id FROM journal_entries WHERE slug = ? AND id != ?')
        .bind(slug, id)
        .first();
      suffix++
    )
      slug = `${base}-${suffix}`;
  }
  const date = current.published?.date ?? new Date().toISOString().slice(0, 10);
  const post = publishedPost(draft, slug, date);
  const result = await db
    .prepare(
      'UPDATE journal_entries SET slug = ?, draft_json = ?, published_json = ?, published_at = ?, updated_at = ?, version = version + 1 WHERE id = ? AND version = ?',
    )
    .bind(
      slug,
      JSON.stringify(draft),
      JSON.stringify(post),
      Date.parse(date + 'T00:00:00Z'),
      Date.now(),
      id,
      version,
    )
    .run();
  if (!result.meta.changes)
    throw new JournalError(
      'This post changed while it was being published. Reload and try again.',
      409,
    );
  return getEntry(id);
}

export async function unpublishEntry(id: string, versionInput: unknown) {
  const version = validateVersion(versionInput);
  const result = await getDb()
    .prepare(
      'UPDATE journal_entries SET published_json = NULL, published_at = NULL, updated_at = ?, version = version + 1 WHERE id = ? AND version = ?',
    )
    .bind(Date.now(), id, version)
    .run();
  if (!result.meta.changes)
    throw new JournalError(
      'This post changed in another tab. Reload before unpublishing.',
      409,
    );
  return getEntry(id);
}
