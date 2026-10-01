'use client';
/* oxlint-disable next/no-html-link-for-pages -- Full navigation retains the editor's native unsaved-work protection. */

import { useCallback, useEffect, useRef, useState } from 'react';
import {
  ArrowLeft,
  ArrowUpRight,
  Bold,
  Heading2,
  ImagePlus,
  Italic,
  Link2,
  List,
  Quote,
  Save,
  Sigma,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ArticleBody } from '@/components/article-body';
import { deskRequest } from '@/components/writing-desk';
import type { Draft, Entry } from '@/lib/journal-model';

type Action = 'save' | 'publish' | 'unpublish';
export function PostEditor({ initialEntry }: { initialEntry: Entry }) {
  const [entry, setEntry] = useState(initialEntry);
  const [draft, setDraft] = useState<Draft>(initialEntry.draft);
  const [saved, setSaved] = useState(JSON.stringify(initialEntry.draft));
  const [status, setStatus] = useState('All changes saved');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [preview, setPreview] = useState(false);
  const [topics, setTopics] = useState(initialEntry.draft.tags.join(', '));
  const [insert, setInsert] = useState<'link' | 'image' | null>(null);
  const [insertUrl, setInsertUrl] = useState('');
  const [insertLabel, setInsertLabel] = useState('');
  const textRef = useRef<HTMLTextAreaElement>(null);
  const draftRef = useRef(draft);
  const entryRef = useRef(entry);
  const savedRef = useRef(saved);
  const queue = useRef(Promise.resolve());
  const selection = useRef({ start: 0, end: 0 });
  const dirty = JSON.stringify(draft) !== saved;
  const patch = (change: Partial<Draft>) =>
    setDraft((previous) => {
      const next = { ...previous, ...change };
      draftRef.current = next;
      return next;
    });

  const persist = useCallback(
    (action: Action): Promise<void> => {
      const run = async () => {
        const snapshot = draftRef.current;
        if (action === 'save' && JSON.stringify(snapshot) === savedRef.current)
          return;
        setBusy(true);
        setError('');
        setStatus(
          action === 'save'
            ? 'Saving…'
            : action === 'publish'
              ? 'Publishing…'
              : 'Unpublishing…',
        );
        try {
          const result = await deskRequest<{ entry: Entry }>(
            `/api/journal/${initialEntry.id}`,
            action === 'save' ? 'PATCH' : 'POST',
            { action, draft: snapshot, version: entryRef.current.version },
          );
          entryRef.current = result.entry;
          setEntry(result.entry);
          // Unpublishing does not save the editor buffer. Leave unsaved text dirty.
          const fingerprint = JSON.stringify(
            action === 'unpublish' ? result.entry.draft : snapshot,
          );
          savedRef.current = fingerprint;
          setSaved(fingerprint);
          setStatus(
            action === 'publish'
              ? 'Published. Your essay is in the journal.'
              : action === 'unpublish'
                ? 'Unpublished. Your draft is kept here.'
                : 'All changes saved',
          );
        } catch (error) {
          setError(
            error instanceof Error
              ? error.message
              : 'Could not save this entry.',
          );
          setStatus('Changes haven’t been saved');
          throw error;
        } finally {
          setBusy(false);
        }
      };
      const next = queue.current.then(run, run);
      // Recover the queue after an error; callers still receive the rejected promise.
      queue.current = next.catch(() => {});
      return next;
    },
    [initialEntry.id],
  );

  useEffect(() => {
    if (!dirty) return;
    const timer = setTimeout(() => {
      void persist('save').catch(() => {});
    }, 1500);
    return () => clearTimeout(timer);
  }, [draft, dirty, persist]);

  useEffect(() => {
    if (!dirty) return;
    const beforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
    };
    const beforeLink = (event: MouseEvent) => {
      const link = (event.target as HTMLElement).closest('a[href]');
      if (
        link &&
        link.getAttribute('target') !== '_blank' &&
        !link.getAttribute('href')?.startsWith('#') &&
        !window.confirm(
          'Some changes are still saving. Leave this page without them?',
        )
      ) {
        event.preventDefault();
        event.stopPropagation();
      }
    };
    window.addEventListener('beforeunload', beforeUnload);
    document.addEventListener('click', beforeLink, true);
    return () => {
      window.removeEventListener('beforeunload', beforeUnload);
      document.removeEventListener('click', beforeLink, true);
    };
  }, [dirty]);

  useEffect(() => {
    const keydown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === 's') {
        event.preventDefault();
        void persist('save').catch(() => {});
      }
    };
    window.addEventListener('keydown', keydown);
    return () => window.removeEventListener('keydown', keydown);
  }, [persist]);

  useEffect(() => {
    type ToolContext = {
      registerTool: (
        tool: {
          name: string;
          description: string;
          inputSchema: object;
          annotations: { readOnlyHint: boolean; untrustedContentHint: boolean };
          execute: (input: unknown) => Promise<unknown>;
        },
        options: { signal: AbortSignal },
      ) => void | Promise<void>;
    };
    const context = (document as Document & { modelContext?: ToolContext })
      .modelContext;
    if (!context?.registerTool) return;
    const lifecycle = new AbortController();
    const reportError = (error: unknown) =>
      console.error(
        'Writing desk agent integration could not register:',
        error,
      );
    try {
      void Promise.resolve(
        context.registerTool(
          {
            name: 'save_journal_draft',
            description:
              'Save the current Mika’s Life editor text as a private draft. Does not publish it.',
            inputSchema: {
              type: 'object',
              properties: {},
              additionalProperties: false,
            },
            annotations: { readOnlyHint: false, untrustedContentHint: false },
            execute: async (input: unknown) => {
              if (
                !input ||
                typeof input !== 'object' ||
                Array.isArray(input) ||
                Object.keys(input).length
              )
                throw new Error('This tool takes an empty object.');
              await persist('save');
              return {
                id: entryRef.current.id,
                version: entryRef.current.version,
                status: 'saved',
              };
            },
          },
          { signal: lifecycle.signal },
        ),
      ).catch(reportError);
    } catch (error) {
      reportError(error);
    }
    return () => lifecycle.abort();
  }, [persist]);

  function format(before: string, after = '', placeholder = 'text') {
    const field = textRef.current;
    if (!field) return;
    const start = field.selectionStart,
      end = field.selectionEnd;
    const chosen = draft.body.slice(start, end) || placeholder;
    patch({
      body:
        draft.body.slice(0, start) +
        before +
        chosen +
        after +
        draft.body.slice(end),
    });
    requestAnimationFrame(() => {
      field.focus();
      field.setSelectionRange(
        start + before.length,
        start + before.length + chosen.length,
      );
    });
  }
  function openInsert(kind: 'link' | 'image') {
    const field = textRef.current;
    selection.current = {
      start: field?.selectionStart || 0,
      end: field?.selectionEnd || 0,
    };
    setInsertLabel(
      draft.body.slice(selection.current.start, selection.current.end),
    );
    setInsertUrl('');
    setInsert(kind);
  }
  function insertMedia(event: React.SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!/^https?:\/\//i.test(insertUrl) || !insertLabel.trim()) return;
    const { start, end } = selection.current;
    const label = insertLabel.replace(/[[\]\n]/g, '');
    const url = insertUrl
      .trim()
      .replace(/\s/g, '%20')
      .replace(/\(/g, '%28')
      .replace(/\)/g, '%29');
    const value = `${insert === 'image' ? '\n\n!' : ''}[${label}](${url})${insert === 'image' ? '\n\n' : ''}`;
    patch({ body: draft.body.slice(0, start) + value + draft.body.slice(end) });
    setInsert(null);
    requestAnimationFrame(() => textRef.current?.focus());
  }
  const wordCount = draft.body.trim()
    ? draft.body.trim().split(/\s+/).length
    : 0;
  return (
    <>
      <header className="editor-top">
        <a href="/write" className="back-link">
          <ArrowLeft size={16} /> Writing desk
        </a>
        <span className="eyebrow">MIKA’S LIFE</span>
        <a href="/blog" className="text-link" target="_blank" rel="noreferrer">
          Journal <ArrowUpRight size={16} />
        </a>
      </header>
      <div className="editor-bar">
        <fieldset className="desk-tabs" aria-label="Editor view">
          <Button
            className="desk-tab"
            aria-pressed={!preview}
            onClick={() => setPreview(false)}
          >
            Write
          </Button>
          <Button
            className="desk-tab"
            aria-pressed={preview}
            onClick={() => setPreview(true)}
          >
            Preview
          </Button>
        </fieldset>
        <div className="editor-actions">
          <Button
            className="desk-button"
            disabled={busy}
            onClick={() => {
              void persist('save').catch(() => {});
            }}
          >
            <Save size={16} />
            Save draft
          </Button>
          <Button
            className="desk-button dark"
            disabled={
              busy ||
              !draft.title.trim() ||
              !draft.description.trim() ||
              !draft.body.trim()
            }
            onClick={() => {
              void persist('publish').catch(() => {});
            }}
          >
            {entry.published ? 'Update post' : 'Publish'}{' '}
            <ArrowUpRight size={16} />
          </Button>
        </div>
      </div>
      <div className="editor-status">
        <span className={`desk-state ${entry.published ? 'is-published' : ''}`}>
          {entry.published ? 'Published' : 'Private draft'}
        </span>
        <output aria-live="polite">
          {dirty && !busy && !error
            ? 'Unsaved changes · autosaving shortly'
            : status}
        </output>
      </div>
      {error && (
        <div className="desk-error" role="alert">
          {error}
        </div>
      )}
      {preview ? (
        <div className="editor-preview">
          <header className="article-header">
            <p className="eyebrow">{draft.tags.join(' / ')}</p>
            <h1>{draft.title || 'Untitled entry'}</h1>
            <p className="article-description">{draft.description}</p>
            <div className="article-byline">
              By Mika · {Math.max(1, Math.ceil(wordCount / 220))} min read
            </div>
          </header>
          <ArticleBody
            body={draft.body || 'Your essay will appear here as you write.'}
          />
        </div>
      ) : (
        <div className="editor-sheet">
          <label htmlFor="post-title" className="eyebrow">
            TITLE
          </label>
          <Textarea
            id="post-title"
            className="editor-title"
            rows={1}
            placeholder="Give this thought a title…"
            maxLength={160}
            value={draft.title}
            onChange={(event) => patch({ title: event.target.value })}
          />
          <label htmlFor="post-description" className="eyebrow">
            A SHORT INTRODUCTION
          </label>
          <Textarea
            id="post-description"
            className="editor-description"
            rows={2}
            placeholder="A sentence or two to bring your reader in."
            maxLength={400}
            value={draft.description}
            onChange={(event) => patch({ description: event.target.value })}
          />
          <label htmlFor="post-topics" className="eyebrow">
            TOPICS <span className="field-hint">/ separated by commas</span>
          </label>
          <Input
            id="post-topics"
            className="desk-input editor-topics"
            placeholder="Science, books, making…"
            value={topics}
            maxLength={328}
            onChange={(event) => {
              setTopics(event.target.value);
              patch({
                tags: event.target.value
                  .split(',')
                  .map((tag) => tag.trim())
                  .filter(Boolean),
              });
            }}
          />
          <fieldset
            className="formatting-toolbar"
            aria-label="Format your writing"
          >
            <Button
              className="format-button"
              title="Bold"
              aria-label="Bold"
              onClick={() => format('**', '**')}
            >
              <Bold size={17} />
            </Button>
            <Button
              className="format-button"
              title="Italic"
              aria-label="Italic"
              onClick={() => format('*', '*')}
            >
              <Italic size={17} />
            </Button>
            <Button
              className="format-button"
              title="Heading"
              aria-label="Heading"
              onClick={() => format('\n\n## ', '\n\n', 'A new section')}
            >
              <Heading2 size={18} />
            </Button>
            <Button
              className="format-button"
              title="Quote"
              aria-label="Quote"
              onClick={() => format('\n\n> ', '\n\n', 'A quotation')}
            >
              <Quote size={17} />
            </Button>
            <Button
              className="format-button"
              title="List"
              aria-label="Bulleted list"
              onClick={() => format('\n\n- ', '\n', 'An item')}
            >
              <List size={18} />
            </Button>
            <Button
              className="format-button"
              title="Add a link"
              aria-label="Add a link"
              onClick={() => openInsert('link')}
            >
              <Link2 size={17} />
            </Button>
            <Button
              className="format-button"
              title="Add an image"
              aria-label="Add an image"
              onClick={() => openInsert('image')}
            >
              <ImagePlus size={18} />
            </Button>
            <Button
              className="format-button"
              title="Add an equation"
              aria-label="Add an equation"
              onClick={() => format('\n\n$$\n', '\n$$\n\n', 'F = ma')}
            >
              <Sigma size={18} />
            </Button>
            <span>Markdown & equations</span>
          </fieldset>
          {insert && (
            <form className="insert-panel" onSubmit={insertMedia}>
              <label>
                {insert === 'image' ? 'Image address' : 'Web address'}
                <Input
                  type="url"
                  className="desk-input"
                  required
                  placeholder="https://…"
                  value={insertUrl}
                  onChange={(event) => setInsertUrl(event.target.value)}
                />
              </label>
              <label>
                {insert === 'image' ? 'Describe the image' : 'Link text'}
                <Input
                  className="desk-input"
                  required
                  value={insertLabel}
                  onChange={(event) => setInsertLabel(event.target.value)}
                />
              </label>
              <div>
                <Button type="submit" className="desk-button dark">
                  Insert {insert}
                </Button>
                <Button
                  type="button"
                  className="desk-button"
                  onClick={() => setInsert(null)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          )}
          <label htmlFor="post-body" className="sr-only">
            Your essay
          </label>
          <Textarea
            id="post-body"
            ref={textRef}
            className="editor-body"
            placeholder="Start anywhere. You can find the beginning later."
            maxLength={80000}
            value={draft.body}
            onChange={(event) => patch({ body: event.target.value })}
          />
        </div>
      )}
      <footer className="editor-bottom">
        <span>
          {wordCount.toLocaleString()} words ·{' '}
          {Math.max(1, Math.ceil(wordCount / 220))} min read
        </span>
        <span>Drafts save automatically. Publishing is up to you.</span>
      </footer>
      {entry.published && (
        <div className="published-tools">
          <a
            href={`/blog/${entry.slug}`}
            target="_blank"
            rel="noreferrer"
            className="text-link"
          >
            Read the published post <ArrowUpRight size={16} />
          </a>
          <Button
            className="desk-button"
            disabled={busy}
            onClick={() => {
              if (
                window.confirm(
                  'Remove this essay from the public journal? Your draft will stay in the writing desk.',
                )
              )
                void persist('unpublish').catch(() => {});
            }}
          >
            Unpublish
          </Button>
        </div>
      )}
    </>
  );
}
