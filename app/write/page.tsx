import Link from 'next/link';
import type { Metadata } from 'next';
import { WritingDesk } from '@/components/writing-desk';
import {
  getChatGPTUser,
  chatGPTSignInPath,
  chatGPTSignOutPath,
} from '@/app/chatgpt-auth';
import { isJournalOwner } from '@/lib/journal-model';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = {
  title: 'Writing desk — Mika’s Life',
  robots: { index: false, follow: false },
};
export default async function Write() {
  const user = await getChatGPTUser();
  if (!user || !isJournalOwner(user, import.meta.env.DEV))
    return (
      <main id="main" className="desk-signin shell">
        <span className="eyebrow">MIKA’S LIFE / WRITING DESK</span>
        <h1>
          A little space
          <br />
          <em>to write.</em>
        </h1>
        <p>
          {user
            ? 'You’re signed in, but this account doesn’t have access to Mika’s writing desk.'
            : 'Sign in to write an entry, return to a draft, or edit a published essay.'}
        </p>
        <a
          className="button primary"
          href={
            user ? chatGPTSignOutPath('/write') : chatGPTSignInPath('/write')
          }
          target="_top"
        >
          {user ? 'Sign out and switch account' : 'Sign in with ChatGPT'}
        </a>
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
        <a href={chatGPTSignOutPath('/blog')} target="_top">
          Sign out
        </a>
      </div>
    </main>
  );
}
