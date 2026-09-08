/* oxlint-disable next/no-img-element -- Author-provided editorial images use a fixed thumbnail ratio. */
import Link from 'next/link';
import Markdown from 'react-markdown';

export function JournalCover({
  body,
  slug,
  title,
}: {
  body: string;
  slug: string;
  title: string;
}) {
  // The first image in an essay is its cover, so the writing desk controls both.
  const match = /!\[([^\]\n]*)\]\((https?:\/\/[^\s)]+|\/(?!\/)[^\s)]+)\)/i.exec(
    body,
  );
  if (!match) return null;
  const following = body
    .slice(match.index + match[0].length)
    .trimStart()
    .split('\n\n')[0];
  const caption = /^\*[^*].*\*$/.test(following) ? following : '';
  return (
    <figure
      className={`journal-photo ${match[2].includes('muybridge') ? 'motion-photo' : ''}`}
    >
      <Link href={`/blog/${slug}`} aria-label={`Read ${title}`}>
        <img
          src={match[2]}
          alt={match[1]}
          width={1200}
          height={800}
          loading="lazy"
          decoding="async"
        />
      </Link>
      {caption && (
        <figcaption>
          <Markdown skipHtml>{caption}</Markdown>
        </figcaption>
      )}
    </figure>
  );
}
