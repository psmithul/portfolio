import { journalApi } from '@/lib/journal-api';
import { JournalError } from '@/lib/journal-model';
import {
  getEntry,
  publishEntry,
  saveEntry,
  unpublishEntry,
} from '@/lib/journal-store';

type Context = { params: Promise<{ id: string }> };
export const dynamic = 'force-dynamic';
export async function GET(request: Request, context: Context) {
  const { id } = await context.params;
  return journalApi(request, async () => ({ entry: await getEntry(id) }));
}
export async function PATCH(request: Request, context: Context) {
  const { id } = await context.params;
  return journalApi(request, async (body) => ({
    entry: await saveEntry(id, body.draft, body.version),
  }));
}
export async function POST(request: Request, context: Context) {
  const { id } = await context.params;
  return journalApi(request, async (body) => {
    if (body.action === 'publish')
      return { entry: await publishEntry(id, body.draft, body.version) };
    if (body.action === 'unpublish')
      return { entry: await unpublishEntry(id, body.version) };
    throw new JournalError('Choose publish or unpublish.');
  });
}
