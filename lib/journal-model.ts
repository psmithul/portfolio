import type { Post } from './post-types';

export type Draft = Pick<Post, 'title' | 'description' | 'body' | 'tags'>;
export type Entry = {
  id: string;
  slug: string;
  draft: Draft;
  published: Post | null;
  updatedAt: number;
  version: number;
};

export class JournalError extends Error {
  status: number;
  constructor(message: string, status = 400) {
    super(message);
    this.status = status;
  }
}

export const emptyDraft: Draft = {
  title: '',
  description: '',
  body: '',
  tags: [],
};

export function validateDraft(value: unknown, publishing = false): Draft {
  if (!value || typeof value !== 'object')
    throw new JournalError('The post is missing.');
  const record = value as Record<string, unknown>;
  const limits = { title: 160, description: 400, body: 80000 };
  const result = { ...emptyDraft };
  for (const [key, limit] of Object.entries(limits)) {
    const field = record[key];
    if (typeof field !== 'string' || field.length > limit) {
      throw new JournalError(
        `${key} must be text with at most ${limit.toLocaleString()} characters.`,
      );
    }
    result[key as 'title' | 'description' | 'body'] = field;
  }
  if (
    !Array.isArray(record.tags) ||
    record.tags.length > 8 ||
    record.tags.some((tag) => typeof tag !== 'string' || tag.length > 40)
  ) {
    throw new JournalError(
      'Use up to eight topics, with at most 40 characters each.',
    );
  }
  result.tags = [
    ...new Set(
      (record.tags as string[]).map((tag) => tag.trim()).filter(Boolean),
    ),
  ];
  if (
    publishing &&
    (!result.title.trim() || !result.description.trim() || !result.body.trim())
  ) {
    throw new JournalError(
      'Add a title, a short introduction, and some text before publishing.',
    );
  }
  return result;
}

export function validateVersion(value: unknown): number {
  if (!Number.isSafeInteger(value) || Number(value) < 1)
    throw new JournalError(
      'The saved version is missing. Reload the post and try again.',
    );
  return Number(value);
}

export function slugify(title: string): string {
  return (
    title
      .normalize('NFKD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
      .slice(0, 90)
      .replace(/-$/g, '') || 'a-new-entry'
  );
}

export function publishedPost(draft: Draft, slug: string, date: string): Post {
  return {
    ...validateDraft(draft, true),
    slug,
    date,
    draft: false,
    readingMinutes: Math.max(
      1,
      Math.ceil(draft.body.trim().split(/\s+/).length / 220),
    ),
  };
}

export function isJournalOwner(
  user: { email: string; userId: string } | null,
): boolean {
  return (
    !!user &&
    user.userId === 'mika' &&
    user.email.toLowerCase() === 'miastromika@gmail.com'
  );
}

export function assertSameOrigin(request: Request) {
  const url = new URL(request.url);
  const host = request.headers.get('host') ?? url.host;
  const forwardedProtocol = process.env.VERCEL
    ? request.headers.get('x-forwarded-proto')
    : null;
  const protocol =
    forwardedProtocol === 'https' || forwardedProtocol === 'http'
      ? forwardedProtocol
      : url.protocol.slice(0, -1);
  // Next may use an internal listener address in request.url. Host retains
  // the origin the browser actually visited; Vercel supplies the HTTPS scheme.
  if (request.headers.get('origin') !== `${protocol}://${host}`)
    throw new JournalError(
      'This action must come from the writing desk on this website.',
      403,
    );
  if (!request.headers.get('content-type')?.startsWith('application/json'))
    throw new JournalError('Send this request as JSON.', 415);
}

export function dateLabel(value: string) {
  return new Date(value + 'T00:00:00Z').toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  });
}
