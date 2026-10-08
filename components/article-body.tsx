/* oxlint-disable next/no-img-element -- Markdown images have author-defined dimensions. */
/* oxlint-disable jsx-a11y/no-noninteractive-tabindex -- Wide tables need a keyboard-accessible scroll container. */
import Markdown from 'react-markdown';
import { readingRemarkPlugins, readingRehypePlugins } from '@/lib/reading';

const imageDimensions: Record<string, { width: number; height: number }> = {
  '/images/projects/tensegrity-leg-cad.webp': { width: 1200, height: 1067 },
  '/images/projects/reaction-wheel-cutaway.webp': { width: 1200, height: 900 },
  '/images/earthrise.jpg': { width: 3000, height: 3000 },
  '/images/muybridge-plate-49.jpg': { width: 900, height: 1200 },
};

export function ArticleBody({ body }: { body: string }) {
  return (
    <article className="article-prose">
      <Markdown
        remarkPlugins={readingRemarkPlugins}
        rehypePlugins={readingRehypePlugins}
        skipHtml
        components={{
          h1: ({ children, id }) => <h2 id={id}>{children}</h2>,
          img: ({ src, alt }) => {
            const dimensions =
              typeof src === 'string' ? imageDimensions[src] : undefined;
            return (
              <img
                src={src}
                alt={alt || ''}
                width={dimensions?.width}
                height={dimensions?.height}
                loading="lazy"
                decoding="async"
              />
            );
          },
          a: ({ href, children }) => (
            <a
              href={href}
              rel={href?.startsWith('http') ? 'noreferrer' : undefined}
            >
              {children}
            </a>
          ),
          table: ({ children }) => (
            <section
              className="table-scroll"
              tabIndex={0}
              aria-label="Article table"
            >
              <table>{children}</table>
            </section>
          ),
        }}
      >
        {body}
      </Markdown>
    </article>
  );
}
