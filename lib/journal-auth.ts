import 'server-only';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { verifyOwnerSession } from './journal-session';

export const JOURNAL_COOKIE = 'mika_desk';
export const journalLoginConfigured = () =>
  !!(process.env.JOURNAL_PASSWORD_HASH && process.env.JOURNAL_SESSION_SECRET);
export async function getJournalOwner() {
  if (!journalLoginConfigured()) return null;
  const token = (await cookies()).get(JOURNAL_COOKIE)?.value;
  if (
    !token ||
    !(await verifyOwnerSession(token, process.env.JOURNAL_SESSION_SECRET!))
  )
    return null;
  return { userId: 'mika', email: 'miastromika@gmail.com' };
}
export async function requireJournalOwner() {
  const owner = await getJournalOwner();
  if (!owner) redirect('/write');
  return owner;
}
