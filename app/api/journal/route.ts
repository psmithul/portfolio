import { journalApi } from '@/lib/journal-api';
import {
  createEntry,
  initializeJournal,
  listEntries,
} from '@/lib/journal-store';

export const dynamic = 'force-dynamic';
export async function GET(request: Request) {
  return journalApi(request, async () => ({ entries: await listEntries() }));
}
export async function POST(request: Request) {
  return journalApi(request, async (body) => {
    if (body.action === 'initialize') {
      await initializeJournal();
      return { entries: await listEntries() };
    }
    return { entry: await createEntry() };
  });
}
