import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { JournalArt } from '@/components/journal-art';
import { JournalLink } from '@/components/journal-link';
import { dateLabel } from '@/lib/journal-model';
import { journalSummary } from '@/lib/journal-editorial';
import type { Post } from '@/lib/post-types';

export function JournalPreview({ posts }: { posts: Post[] }) {
  const [lead, ...rest] = posts.slice(0, 4).map(journalSummary);
  return (
    <section
      className="flow-journal journal-home flow-section shell"
      id="journal"
    >
      <div className="journal-home-heading">
        <div>
          <p className="eyebrow">06 — Journal</p>
          <h2>
            Mika’s <em>Life.</em>
          </h2>
        </div>
        <div>
          <p>
            Things I’ve been reading about, trying out, and still figuring out.
          </p>
          <JournalLink href="/blog">
            All my notes <ArrowUpRight size={20} aria-hidden="true" />
          </JournalLink>
        </div>
      </div>
      {lead ? (
        <div className="journal-home-spread">
          <JournalLink
            className="journal-home-lead"
            href={`/blog/${lead.slug}`}
            aria-label={`Read ${lead.title}`}
          >
            <JournalArt post={lead} />
            <div className="journal-home-lead-copy">
              <span className="eyebrow">Latest note · {lead.category}</span>
              <h3>{lead.title}</h3>
              <p>{lead.description}</p>
              <div className="journal-card-bottom">
                <span>
                  <time dateTime={lead.date}>{dateLabel(lead.date)}</time> ·{' '}
                  {lead.readingMinutes} min
                </span>
                <ArrowRight size={21} aria-hidden="true" />
              </div>
            </div>
          </JournalLink>
          <div className="journal-home-side">
            <p className="journal-side-label">Also in my notebook</p>
            {rest.map((post) => (
              <JournalLink
                className="journal-home-note"
                key={post.slug}
                href={`/blog/${post.slug}`}
                aria-label={`Read ${post.title}`}
              >
                <JournalArt post={post} />
                <div>
                  <span className="eyebrow">
                    {post.category} · {post.readingMinutes} min
                  </span>
                  <h3>{post.title}</h3>
                  <time dateTime={post.date}>{dateLabel(post.date)}</time>
                </div>
                <ArrowUpRight size={20} aria-hidden="true" />
              </JournalLink>
            ))}
            <JournalLink href="/blog" className="journal-home-more">
              Find something to read <ArrowRight size={18} aria-hidden="true" />
            </JournalLink>
          </div>
        </div>
      ) : (
        <p className="journal-empty-note">
          There are no published entries yet.
        </p>
      )}
    </section>
  );
}
