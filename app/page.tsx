import Link from 'next/link';
import { Cog, Move3d, Radio, Waves, ArrowUpRight } from 'lucide-react';
import { PortraitStory } from '@/components/portrait-story';
import { EngineeringThumbnail } from '@/components/engineering-thumbnail';
import { MotionDirector } from '@/components/motion-director';
import type { ModelKind } from '@/lib/engineering-scene';
import { projects } from '@/content/projects';
import { getPublicPosts } from '@/lib/journal-store';

export const dynamic = 'force-dynamic';
export default async function Home() {
  const posts = await getPublicPosts();
  return (
    <main id="main" className="research-home">
      <MotionDirector />
      <PortraitStory />
      <div className="discipline-strip" aria-label="Research interests">
        <div className="shell">
          {[
            ['Rough-terrain robotics', Move3d],
            ['Dynamics & vibration', Waves],
            ['Mechanisms', Cog],
            ['Sensing & control', Radio],
          ].map(([label, Icon]) => {
            const Item = Icon as typeof Cog;
            return (
              <span key={String(label)}>
                <Item size={20} aria-hidden="true" />
                {String(label)}
              </span>
            );
          })}
        </div>
      </div>
      <section id="work" className="lab-work shell">
        <div className="lab-section-heading showcase-heading">
          <div>
            <p className="eyebrow">01 / THE ENGINEERING</p>
            <h2>
              Selected <em>projects.</em>
            </h2>
          </div>
          <p>
            Some are still taking shape. Others have a result to share. Here’s
            what I’ve been building and studying.
          </p>
        </div>
        <div className="lab-project-grid">
          {projects.slice(0, 4).map((project) => (
            <Link
              href={`/work/${project.slug}`}
              className={`lab-project-card project-${project.model}`}
              key={project.slug}
            >
              <div className="project-visual-wrap">
                <div className="visual-card-top">
                  <span>
                    {project.number} / {project.discipline}
                  </span>
                  <span className="project-status">{project.status}</span>
                </div>
                <div className="project-art">
                  <EngineeringThumbnail kind={project.model as ModelKind} />
                </div>
                <span className="visual-card-bottom">
                  CONCEPT VISUAL / {project.discipline.toUpperCase()}
                </span>
              </div>
              <div className="lab-project-info">
                <span className="eyebrow">{project.period}</span>
                <div className="project-title-line">
                  <h3>{project.title}</h3>
                  <ArrowUpRight size={24} aria-hidden="true" />
                </div>
                <p>{project.summary}</p>
                <div className="lab-tool-tags">
                  {project.tools.slice(0, 3).map((tool) => (
                    <span key={tool}>{tool}</span>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>
        <div className="lab-archive-heading">
          <h3>Earlier builds & other questions</h3>
          <span className="eyebrow">
            {String(projects.length - 4).padStart(2, '0')} PROJECTS
          </span>
        </div>
        <div className="lab-project-archive">
          {projects.slice(4).map((project) => (
            <Link href={`/work/${project.slug}`} key={project.slug}>
              <span className="archive-number">{project.number}</span>
              <div>
                <span className="eyebrow">{project.discipline}</span>
                <h3>{project.title}</h3>
              </div>
              <span className="archive-period">{project.period}</span>
              <span className="archive-open">Open</span>
            </Link>
          ))}
        </div>
      </section>
      <section className="lab-about shell">
        <div>
          <p className="eyebrow">02 / A LITTLE CONTEXT</p>
          <h2>
            I like making things.
            <br />
            And <em>understanding them.</em>
          </h2>
        </div>
        <div>
          <p>
            I’m a builder with a growing interest in research. I like working
            through a mechanism, making a model, and figuring out which test
            would tell me something useful. Field robotics brings those
            interests together.
          </p>
          <p>
            At Vayu Aerospace, I compared flight-controller mounting concepts,
            supported ground motor-run tests, and studied IMU logs to help
            choose a vibration-isolation direction.
          </p>
          <Link href="/about" className="lab-button secondary">
            More about me
          </Link>
        </div>
      </section>
      <section className="lab-journal shell">
        <div className="journal-teaser-heading">
          <p className="eyebrow">03 / OFF THE CLOCK</p>
          <h2>
            Mika’s <em>Life.</em>
          </h2>
          <p>
            Notes on science, books, and whatever stays with me after the day is
            done.
          </p>
          <Link href="/blog" className="quiet-link">
            Visit the journal
          </Link>
        </div>
        <div className="journal-mini-entries">
          {posts.slice(0, 3).map((post, i) => (
            <Link href={`/blog/${post.slug}`} key={post.slug}>
              <span className="journal-mini-number">0{i + 1}</span>
              <div>
                <span className="eyebrow">
                  {post.tags.slice(0, 2).join(' / ')}
                </span>
                <h3>{post.title}</h3>
                <p>{post.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
      <section className="lab-contact shell">
        <p className="eyebrow">RESEARCH, ROBOTS, OR SOMETHING INTERESTING</p>
        <a href="mailto:psmithul@gmail.com">
          Let’s talk<span>.</span>
        </a>
        <p>psmithul@gmail.com</p>
      </section>
    </main>
  );
}
