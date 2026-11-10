import Link from 'next/link';
import {
  portfolioExperience,
  portfolioRecognition,
  type PortfolioExperience,
} from '@/content/profile';

function ExperienceList({ entries }: { entries: PortfolioExperience[] }) {
  return entries.map(
    ({ company, role, period, location, highlights, href, link }) => (
      <article className="academic-experience" key={company}>
        <header>
          <h4>{company}</h4>
          <span>{period}</span>
        </header>
        <p className="academic-role">
          {role}
          {location && ` · ${location}`}
        </p>
        <ul>
          {highlights.map((highlight) => (
            <li key={highlight}>{highlight}</li>
          ))}
        </ul>
        {href && <Link href={href}>{link ?? 'Read the case study'} →</Link>}
      </article>
    ),
  );
}

export function ActivitiesExperience() {
  return (
    <section
      className="portfolio-section portfolio-activities"
      id="activities"
      aria-labelledby="activities-heading"
    >
      <header className="portfolio-section-heading">
        <h2 id="activities-heading">Activities &amp; experience</h2>
      </header>
      <div className="portfolio-activity-layout">
        <div className="academic-activity-group" id="experience">
          <h3>Work experience</h3>
          <ExperienceList
            entries={portfolioExperience.filter(
              ({ category }) => category !== 'Leadership',
            )}
          />
        </div>
        <div className="academic-activity-group" id="leadership">
          <h3>Student leadership</h3>
          <ExperienceList
            entries={portfolioExperience.filter(
              ({ category }) => category === 'Leadership',
            )}
          />
        </div>
        <div className="academic-activity-group" id="recognition">
          <h3>Awards &amp; competitions</h3>
          {portfolioRecognition.map(
            ({ title, period, result, detail, href, link }) => (
              <div className="academic-recognition" key={title}>
                <span>{period}</span>
                <div>
                  <h4>{title}</h4>
                  <p>
                    <strong>{result}</strong>. {detail}
                  </p>
                  <Link href={href}>{link} →</Link>
                </div>
              </div>
            ),
          )}
        </div>
      </div>
    </section>
  );
}
