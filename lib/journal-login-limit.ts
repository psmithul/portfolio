import 'server-only';
import { createHmac } from 'node:crypto';
import { get, put, BlobPreconditionFailedError } from '@vercel/blob';
import { JournalError } from './journal-model';

export async function limitDeskLogin(request: Request) {
  const ip = process.env.VERCEL
    ? (request.headers.get('x-vercel-forwarded-for') ?? 'unknown')
    : 'local';
  const hash = createHmac('sha256', process.env.JOURNAL_SESSION_SECRET!)
    .update(ip)
    .digest('hex');
  const path = `login-limits/${process.env.VERCEL_ENV ?? 'development'}/${hash}.json`;
  for (let attempt = 0; attempt < 3; attempt++) {
    const blob = await get(path, {
      access: 'private',
      useCache: false,
      headers: { 'accept-encoding': 'identity' },
    });
    const now = Date.now();
    const old =
      blob?.statusCode === 200 && blob.stream
        ? ((await new Response(blob.stream).json()) as {
            until: number;
            count: number;
          })
        : null;
    const limit =
      old && old.until > now ? old : { until: now + 15 * 60 * 1000, count: 0 };
    if (limit.count >= 6)
      throw new JournalError(
        'Too many sign-in attempts. Please wait 15 minutes.',
        429,
      );
    limit.count++;
    try {
      await put(path, JSON.stringify(limit), {
        access: 'private',
        contentType: 'application/json',
        addRandomSuffix: false,
        allowOverwrite: !!blob,
        ifMatch: blob?.blob.etag,
        cacheControlMaxAge: 60,
      });
      return;
    } catch (error) {
      if (
        error instanceof BlobPreconditionFailedError ||
        (error instanceof Error && /already exists/i.test(error.message))
      )
        continue;
      throw error;
    }
  }
  throw new JournalError('Sign-in is busy. Please try again in a moment.', 503);
}
