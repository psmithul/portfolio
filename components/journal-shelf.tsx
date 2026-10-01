'use client';

import { useState } from 'react';
import { ArrowUpRight, ArrowRight } from 'lucide-react';
import { JournalArt } from '@/components/journal-art';
import { JournalLink } from '@/components/journal-link';
import { dateLabel } from '@/lib/journal-model';
import type { JournalCategory, JournalSummary } from '@/lib/journal-editorial';

export function JournalShelf({ posts }: { posts: JournalSummary[] }) {
  const [filter, setFilter] = useState<'All' | JournalCategory>('All');
  const categories = (['All', 'AI', 'Controls', 'Other'] as const).filter(
    (category) =>
      category === 'All' || posts.some((post) => post.category === category),
  );
  const visible = posts.filter(
    (post) => filter === 'All' || post.category === filter,
  );
  const [lead, ...rest] = visible;
  return (
    <section className="journal-shelf" aria-label="Journal entries">
      <div className="journal-shelf-bar">
        <fieldset className="journal-filters">
          <legend className="sr-only">Filter entries by topic</legend>
          {categories.map((category) => (
            <button
              type="button"
              key={category}
              aria-pressed={filter === category}
              onClick={() => setFilter(category)}
            >
              {category === 'All' ? 'All notes' : category}
              <span>
                {category === 'All'
                  ? posts.length
                  : posts.filter((post) => post.category === category).length}
              </span>
            </button>
          ))}
        </fieldset>
        <output className="journal-result-count" aria-live="polite">
          {visible.length} {visible.length === 1 ? 'entry' : 'entries'}
        </output>
      </div>
      {!lead && (
        <p className="journal-empty-note">
          There are no published entries yet.
        </p>
      )}
      {lead && (
        <JournalLink
          href={`/blog/${lead.slug}`}
          className="journal-lead"
          aria-label={`Read ${lead.title}`}
        >
          <JournalArt post={lead} />
          <div className="journal-lead-copy">
            <div className="journal-card-meta">
              <span>
                {lead.category === 'Other' ? 'From my notebook' : lead.category}
              </span>
              <span>
                {filter === 'All' ? 'Latest note' : 'Latest in ' + filter}
              </span>
            </div>
            <h2>{lead.title}</h2>
            <p>{lead.description}</p>
            <div className="journal-card-bottom">
              <span>
                <time dateTime={lead.date}>{dateLabel(lead.date)}</time> ·{' '}
                {lead.readingMinutes} min read
              </span>
              <span className="journal-read-label">
                Read the note <ArrowRight size={19} aria-hidden="true" />
              </span>
            </div>
          </div>
        </JournalLink>
      )}
      {rest.length > 0 && (
        <div className="journal-card-grid">
          {rest.map((post) => (
            <JournalLink
              href={`/blog/${post.slug}`}
              className="journal-card"
              key={post.slug}
              aria-label={`Read ${post.title}`}
            >
              <JournalArt post={post} />
              <div className="journal-card-copy">
                <div className="journal-card-meta">
                  <span>
                    {post.category === 'Other' ? post.tags[0] : post.category}
                  </span>
                  <span>{post.readingMinutes} min read</span>
                </div>
                <h2>{post.title}</h2>
                <p>{post.description}</p>
                <div className="journal-card-bottom">
                  <time dateTime={post.date}>{dateLabel(post.date)}</time>
                  <ArrowUpRight size={21} aria-hidden="true" />
                </div>
              </div>
            </JournalLink>
          ))}
        </div>
      )}
    </section>
  );
}
