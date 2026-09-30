import Link from 'next/link';
import type { Metadata } from 'next';
import { WritingDesk } from '@/components/writing-desk';
import { getJournalOwner, journalLoginConfigured } from '@/lib/journal-auth';
import { journalStorageConfigured } from '@/lib/journal-store';
import { DeskLogin, DeskSignOut } from '@/components/desk-login';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = {
  title: 'Writing desk — Mika’s Life',
  robots: { index: false, follow: false },
};
export default async function Write() {
  const user = await getJournalOwner();
  if (!user)
    return (
      <main id="main" className="desk-signin shell">
        <span className="eyebrow">MIKA’S LIFE / WRITING DESK</span>
        <h1>
          A little space
          <br />
          <em>to write.</em>
        </h1>
        <p>
          Sign in to write an entry, return to a draft, or edit a published
          essay.
        </p>
        {journalLoginConfigured() && journalStorageConfigured() ? (
          <DeskLogin />
        ) : (
          <p>
            The writing desk is being connected. Published entries are available
            below.
          </p>
        )}
        <Link href="/blog" className="text-link">
          Read Mika’s Life
        </Link>
      </main>
    );
  return (
    <main id="main" className="desk-page shell">
      <WritingDesk />
      <div className="desk-account">
        <span>Signed in as {user.email}</span>
        <DeskSignOut />
      </div>
    </main>
  );
}
