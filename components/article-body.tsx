/* oxlint-disable next/no-img-element -- Markdown images have author-defined dimensions. */
/* oxlint-disable jsx-a11y/no-noninteractive-tabindex -- Wide tables need a keyboard-accessible scroll container. */
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export function ArticleBody({ body }: { body: string }) {
  return (
    <article className="article-prose">
      <Markdown
        remarkPlugins={[remarkGfm]}
        skipHtml
        components={{
          h1: ({ children }) => <h2>{children}</h2>,
          img: ({ src, alt }) => (
            <img src={src} alt={alt || ''} loading="lazy" decoding="async" />
          ),
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
