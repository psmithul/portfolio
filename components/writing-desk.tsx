'use client';

import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { ArrowUpRight, Download, Plus, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { Entry } from '@/lib/journal-model';

export async function deskRequest<T>(
  url: string,
  method = 'GET',
  body?: unknown,
): Promise<T> {
  const options: RequestInit = { method, cache: 'no-store' };
  if (body && method !== 'GET') {
    options.headers = { 'Content-Type': 'application/json' };
    options.body = JSON.stringify(body);
  }
  const response = await fetch(url, options);
  const result = (await response.json()) as T & { error?: string };
  if (!response.ok)
    throw new Error(result.error || 'The request failed. Please try again.');
  return result;
}

export function WritingDesk() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const load = useCallback(async () => {
    try {
      const data = await deskRequest<{ entries: Entry[] }>(
        '/api/journal',
        'POST',
        { action: 'initialize' },
      );
      setEntries(data.entries);
      setError('');
    } catch (error) {
      setError(
        error instanceof Error ? error.message : 'Could not load your posts.',
      );
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => {
    // Network completion updates state; this effect does not derive local state.
    let active = true;
    deskRequest<{ entries: Entry[] }>('/api/journal', 'POST', {
      action: 'initialize',
    })
      .then((data) => {
        if (active) {
          setEntries(data.entries);
          setError('');
        }
      })
      .catch((error: unknown) => {
        if (active)
          setError(
            error instanceof Error
              ? error.message
              : 'Could not load your posts.',
          );
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  async function newEntry() {
    setBusy(true);
    setError('');
    try {
      const data = await deskRequest<{ entry: Entry }>('/api/journal', 'POST', {
        action: 'create',
      });
      window.location.assign(`/write/${data.entry.id}`);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : 'Could not create a draft.',
      );
      setBusy(false);
    }
  }
  function exportEntries() {
    const url = URL.createObjectURL(
      new Blob(
        [
          JSON.stringify(
            {
              journal: 'Mika’s Life',
              exportedAt: new Date().toISOString(),
              entries,
            },
            null,
            2,
          ),
        ],
        { type: 'application/json' },
      ),
    );
    const link = document.createElement('a');
    link.href = url;
    link.download = `mikas-life-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  const visible = entries.filter(
    (entry) =>
      (filter === 'all' ||
        (filter === 'published' ? !!entry.published : !entry.published)) &&
      `${entry.draft.title} ${entry.draft.tags.join(' ')}`
        .toLowerCase()
        .includes(search.toLowerCase()),
  );
  return (
    <>
      <header className="desk-heading">
        <div>
          <p className="eyebrow">MIKA’S LIFE</p>
          <h1>
            Your writing desk<span>.</span>
          </h1>
          <p>
            A place for the next thought, and the one you left halfway through.
          </p>
        </div>
        <Button
          className="desk-button dark"
          onClick={newEntry}
          disabled={busy || loading}
        >
          <Plus size={17} />
          {busy ? 'Opening…' : 'New entry'}
        </Button>
      </header>
      <div className="desk-tools">
        <fieldset className="desk-tabs" aria-label="Filter entries">
          {['all', 'drafts', 'published'].map((value) => (
            <Button
              key={value}
              className="desk-tab"
              aria-pressed={filter === value}
              onClick={() => setFilter(value)}
            >
              {value === 'all'
                ? `All entries (${entries.length})`
                : value === 'drafts'
                  ? 'Drafts'
                  : 'Published'}
            </Button>
          ))}
        </fieldset>
        <label className="desk-search" htmlFor="entry-search">
          <Search size={16} />
          <span className="sr-only">Search your entries</span>
          <Input
            id="entry-search"
            className="desk-input"
            placeholder="Find an entry…"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </label>
      </div>
      {error && (
        <div className="desk-error" role="alert">
          <p>{error}</p>
          <Button className="desk-button" onClick={load}>
            Try again
          </Button>
        </div>
      )}
      {loading ? (
        <output className="desk-empty">Opening your notebook…</output>
      ) : (
        <div className="desk-entry-list">
          {visible.map((entry) => (
            <a
              className="desk-entry"
              href={`/write/${entry.id}`}
              key={entry.id}
            >
              <div>
                <span
                  className={`desk-state ${entry.published ? 'is-published' : ''}`}
                >
                  {entry.published ? 'Published' : 'Draft'}
                </span>
                <h2>{entry.draft.title || 'Untitled entry'}</h2>
                <p>
                  {entry.draft.description ||
                    'A fresh page. Pick up where you left off.'}
                </p>
              </div>
              <div className="desk-entry-date">
                <time dateTime={new Date(entry.updatedAt).toISOString()}>
                  Edited{' '}
                  {new Date(entry.updatedAt).toLocaleDateString('en-GB', {
                    day: 'numeric',
                    month: 'short',
                  })}
                </time>
                <ArrowUpRight size={22} />
              </div>
            </a>
          ))}
          {!visible.length && !error && (
            <div className="desk-empty">
              <h2>
                {search
                  ? 'No entries found.'
                  : filter === 'drafts'
                    ? 'No unfinished drafts.'
                    : 'A fresh page awaits.'}
              </h2>
              <p>
                {search
                  ? 'Try a different title or topic.'
                  : 'Choose New entry whenever you’re ready.'}
              </p>
            </div>
          )}
        </div>
      )}
      <footer className="desk-bottom">
        <Link className="text-link" href="/blog">
          Visit the journal <ArrowUpRight size={16} />
        </Link>
        <Button
          className="desk-button"
          onClick={exportEntries}
          disabled={loading || !entries.length}
        >
          <Download size={16} />
          Download a backup
        </Button>
      </footer>
    </>
  );
}
