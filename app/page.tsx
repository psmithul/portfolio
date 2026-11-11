import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import { profile } from '@/content/profile';
import { ActivitiesExperience } from '@/components/academic/activities-experience';
import { SocialLinks } from '@/components/academic/social-links';
import { sitePages } from '@/lib/site-paths';

export const metadata: Metadata = {
  alternates: { canonical: sitePages.about },
};

export default function AboutPage() {
  return (
    <main id="main" className="academic-content portfolio-page">
      <header className="portfolio-hero" id="about">
        <h1 className="sr-only">About me</h1>
        <figure className="portfolio-portrait">
          <Image
            className="academic-home-photo"
            src="/images/mithul-profile-photo-cutout.webp"
            fill
            sizes="(max-width: 820px) 200px, 240px"
            alt="Portrait of Mithul Sourav"
            preload
          />
        </figure>
        <div className="portfolio-intro-copy">
          {profile.bio.map((paragraph) => (
            <p className="academic-lead" key={paragraph}>
              {paragraph}
            </p>
          ))}
        </div>
        <div className="portfolio-actions">
          <Link href={sitePages.projects}>
            Selected projects <span aria-hidden="true">→</span>
          </Link>
          <a href="#contact">Get in touch</a>
        </div>
      </header>
      <ActivitiesExperience />
      <section
        className="portfolio-section academic-contact"
        id="contact"
        aria-label="Get in touch"
      >
        <header className="portfolio-section-heading">
          <h2>Get in touch</h2>
        </header>
        <div className="portfolio-contact-links">
          <a href="mailto:psmithul@gmail.com">psmithul@gmail.com</a>
          <SocialLinks />
        </div>
      </section>
    </main>
  );
}
