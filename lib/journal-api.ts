import { getJournalOwner } from './journal-auth';
import {
  assertSameOrigin,
  isJournalOwner,
  JournalError,
} from './journal-model';

export async function journalApi(
  request: Request,
  action: (body: Record<string, unknown>) => Promise<unknown>,
) {
  try {
    const user = await getJournalOwner();
    if (!user)
      throw new JournalError('Sign in to open your writing desk.', 401);
    if (!isJournalOwner(user))
      throw new JournalError('This writing desk belongs to Mika.', 403);
    let body: Record<string, unknown> = {};
    if (request.method !== 'GET') {
      assertSameOrigin(request);
      const raw = await request.text();
      if (raw.length > 100000)
        throw new JournalError(
          'This post is too long to save. Keep it under 80,000 characters.',
          413,
        );
      try {
        body = JSON.parse(raw);
      } catch {
        throw new JournalError(
          'The request could not be read. Try saving again.',
        );
      }
      if (!body || typeof body !== 'object' || Array.isArray(body))
        throw new JournalError('The request must contain a post.');
    }
    return Response.json(await action(body), {
      headers: { 'Cache-Control': 'private, no-store' },
    });
  } catch (error) {
    if (error instanceof JournalError)
      return Response.json(
        { error: error.message },
        {
          status: error.status,
          headers: { 'Cache-Control': 'private, no-store' },
        },
      );
    console.error(
      'Journal request failed:',
      error instanceof Error ? error.name : 'Unknown error',
    );
    return Response.json(
      {
        error:
          'The writing desk could not reach the database. Your text is still in the editor. Please try again.',
      },
      { status: 500, headers: { 'Cache-Control': 'private, no-store' } },
    );
  }
}
