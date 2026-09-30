import Link from 'next/link';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PostEditor } from '@/components/post-editor';
import { requireJournalOwner } from '@/lib/journal-auth';
import { isJournalOwner, JournalError } from '@/lib/journal-model';
import { getEntry } from '@/lib/journal-store';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = {
  title: 'Edit an entry — Mika’s Life',
  robots: { index: false, follow: false },
};
export default async function EditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return <ProtectedEditor id={(await params).id} />;
}
async function ProtectedEditor({ id }: { id: string }) {
  const user = await requireJournalOwner();
  if (!isJournalOwner(user))
    return (
      <main id="main" className="desk-signin shell">
        <h1>This desk belongs to Mika.</h1>
        <Link href="/write" className="text-link">
          Switch account
        </Link>
      </main>
    );
  let entry;
  try {
    entry = await getEntry(id);
  } catch (error) {
    if (error instanceof JournalError && error.status === 404) notFound();
    throw error;
  }
  return (
    <main id="main" className="editor-page shell">
      <PostEditor initialEntry={entry} />
    </main>
  );
}
