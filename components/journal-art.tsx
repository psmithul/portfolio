/* oxlint-disable next/no-img-element -- Covers added in the writing desk retain their original URL. */
import { journalArtKind, type JournalSummary } from '@/lib/journal-editorial';

export function JournalArt({ post }: { post: JournalSummary }) {
  if (post.cover)
    return (
      <div className="journal-art journal-art-photo">
        <img
          src={post.cover.src}
          alt={post.cover.alt}
          loading="lazy"
          decoding="async"
        />
      </div>
    );
  const kind = journalArtKind(post);
  return (
    <div className={`journal-art journal-art-${kind}`} aria-hidden="true">
      <span className="journal-art-kicker">
        {post.category === 'Controls'
          ? 'On learning control'
          : post.category === 'AI'
            ? 'Notes on AI'
            : 'Notes and questions'}
      </span>
      {kind === 'control' ? (
        <>
          <span className="journal-art-letters">
            P<span>·</span>I<span>·</span>D
          </span>
          <svg
            className="journal-art-response"
            viewBox="0 0 480 190"
            fill="none"
          >
            <path
              className="journal-art-grid"
              d="M20 30H460M20 75H460M20 120H460M20 165H460M20 15V175M130 15V175M240 15V175M350 15V175M460 15V175"
            />
            <path className="journal-art-target" d="M20 75H460" />
            <path
              className="journal-art-curve"
              d="M20 165C50 165 48 27 99 27S151 103 196 103S254 63 302 63S361 79 398 79S442 75 460 75"
            />
            <circle cx="460" cy="75" r="5" fill="currentColor" />
          </svg>
          <span className="journal-art-bottom">A question of feedback.</span>
        </>
      ) : (
        <>
          <div className="journal-art-orbits">
            <i />
            <i />
            <i />
          </div>
          <span className="journal-art-number">
            {kind === 'sol' ? '5.6' : kind === 'note' ? 'Aa' : '6'}
          </span>
          <span className="journal-art-bottom">
            {kind === 'efficiency'
              ? 'Sol / Luna'
              : kind === 'astra'
                ? 'Astra'
                : kind === 'sol'
                  ? 'Sol'
                  : 'A page from my notebook'}
          </span>
          <span className="journal-art-margin">Mika’s Life</span>
        </>
      )}
    </div>
  );
}
