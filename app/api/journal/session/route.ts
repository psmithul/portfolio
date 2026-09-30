import { cookies } from 'next/headers';
import { JOURNAL_COOKIE, journalLoginConfigured } from '@/lib/journal-auth';
import {
  createOwnerSession,
  verifyDeskPassword,
  SESSION_SECONDS,
} from '@/lib/journal-session';
import { assertSameOrigin, JournalError } from '@/lib/journal-model';
import { journalStorageConfigured } from '@/lib/journal-store';
import { limitDeskLogin } from '@/lib/journal-login-limit';

export const dynamic = 'force-dynamic';
export async function POST(request: Request) {
  try {
    assertSameOrigin(request);
    if (!journalLoginConfigured() || !journalStorageConfigured())
      throw new JournalError('The writing desk is not configured yet.', 503);
    const raw = await request.text();
    if (raw.length > 2048)
      throw new JournalError('The sign-in request is too long.', 413);
    let body: { action?: unknown; password?: unknown };
    try {
      body = JSON.parse(raw);
    } catch {
      throw new JournalError('The sign-in request could not be read.');
    }
    if (!body || typeof body !== 'object')
      throw new JournalError('The sign-in request is missing.');
    const jar = await cookies();
    if (body.action === 'signout') {
      jar.delete(JOURNAL_COOKIE);
      return Response.json(
        { ok: true },
        { headers: { 'Cache-Control': 'private, no-store' } },
      );
    }
    if (typeof body.password !== 'string' || body.password.length > 256)
      throw new JournalError('Enter your writing desk password.');
    await limitDeskLogin(request);
    if (
      !(await verifyDeskPassword(
        body.password,
        process.env.JOURNAL_PASSWORD_HASH!,
      ))
    )
      throw new JournalError('That password is not correct.', 401);
    const token = await createOwnerSession(process.env.JOURNAL_SESSION_SECRET!);
    jar.set(JOURNAL_COOKIE, token, {
      httpOnly: true,
      secure: !!process.env.VERCEL,
      sameSite: 'strict',
      maxAge: SESSION_SECONDS,
      path: '/',
    });
    return Response.json(
      { ok: true },
      { headers: { 'Cache-Control': 'private, no-store' } },
    );
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
      'Writing desk sign-in failed:',
      error instanceof Error ? error.name : 'Unknown error',
    );
    return Response.json(
      { error: 'The writing desk could not sign you in. Please try again.' },
      { status: 500, headers: { 'Cache-Control': 'private, no-store' } },
    );
  }
}
