export function SectionNav({
  links,
}: {
  links: { id: string; label: string }[];
}) {
  return (
    <nav className="academic-section-nav" aria-label="On this page">
      <ul>
        {links.map(({ id, label }) => (
          <li key={id}>
            <a href={`#${id}`}>{label}</a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
