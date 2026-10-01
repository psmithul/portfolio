import { readingHeadings } from '@/lib/reading';

export function ReadingContents({ body }: { body: string }) {
  const headings = readingHeadings(body);
  if (!headings.length) return null;
  return (
    <nav className="reading-contents" aria-label="On this page">
      <p className="eyebrow">On this page</p>
      <ol>
        {headings.map(({ id, title }) => (
          <li key={id}>
            <a href={`#${id}`}>{title}</a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
