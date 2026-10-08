'use client';

import { chapterEntryTimeline } from '@/lib/journey-tour';
import { MinecraftLoader } from '@/components/minecraft-loader';

// Document navigation ends the scene's scroll controller before opening a
// reading page, so the journey position cannot overwrite its initial scroll.
/* oxlint-disable next/no-html-link-for-pages */

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Box,
  Check,
  Copy,
  Mail,
  Map,
  Moon,
  Mouse,
  Pause,
  Play,
  RotateCcw,
  Truck,
  Sun,
  Settings2,
  TrainFront,
  Volume2,
  VolumeX,
  X,
} from 'lucide-react';
import {
  currentProjectSlugs,
  journeyExperience,
  shortProjectNames,
  stations,
} from '@/content/journey';
import type { Project } from '@/content/projects';
import { journeyPosition, journeyOffset } from '@/lib/journey-timeline';
import { experienceReadingPhase } from '@/lib/journey-choreography';
import { createJourneyScroll, type JourneyScroll } from '@/lib/journey-scroll';
import type { JournalSummary } from '@/lib/journal-editorial';
import type { VoxelWorld, WorldOptions, WorldAction } from '@/lib/voxel-world';

const EngineeringPlayground = dynamic(
  () =>
    import('@/components/engineering-playground').then(
      (m) => m.EngineeringPlayground,
    ),
  {
    ssr: false,
    loading: () => <MinecraftLoader label="Opening the workbench…" compact />,
  },
);
const projectModel = {
  'adaptive-suspension-rover': 'rover',
  'tensegrity-joint': 'tensegrity',
  'off-road-leaf-robot': 'collection',
} as const;

export function TrainJourney({
  projects,
  posts,
  onStatic,
  onReady,
  started = true,
  initialAutomatic = false,
}: {
  projects: Project[];
  posts: JournalSummary[];
  onStatic?: () => void;
  onReady?: () => void;
  started?: boolean;
  initialAutomatic?: boolean;
}) {
  const host = useRef<HTMLDivElement>(null);
  const engine = useRef<VoxelWorld | null>(null);
  const scroll = useRef<JourneyScroll | null>(null);
  const restored = useRef(false);
  const publishPosition = useRef<(y: number) => void>(() => {});
  const world = useRef<WorldOptions>({
    timeline: 0,
    progress: 0,
    phase: 0,
    stop: 0,
    experience: 0,
    onboard: false,
    reading: null,
    mobile: false,
    reducedMotion: false,
    night: false,
    navigationRevision: 0,
  });
  const planetRefs = useRef<(HTMLElement | null)[]>([]);
  const sceneAction = useRef<(action: WorldAction) => void>(() => {});
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);
  const settingsMenu = useRef<HTMLDetailsElement>(null);
  const sound = useRef<HTMLAudioElement | null>(null);
  // Phones use the document portfolio; every device mounting this scene gets
  // the full journey, including portrait iPads and smaller desktop windows.
  const mobile = false;
  const [tourPlaying, setTourPlaying] = useState(false);
  const [active, setActive] = useState(0);
  const [ready, setReady] = useState(false);
  const [unavailable, setUnavailable] = useState(false);
  const [onboard, setOnboard] = useState(false);
  const [reading, setReading] = useState<boolean | null>(null);
  const [night, setNight] = useState(false);
  const [muted, setMuted] = useState(true);
  const [routeOpen, setRouteOpen] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [lab, setLab] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const labTrigger = useRef<HTMLButtonElement | null>(null);
  const closeLab = useRef<HTMLButtonElement>(null);
  const labDialog = useRef<HTMLDialogElement>(null);
  const featured = currentProjectSlugs.map((slug) =>
    projects.find((p) => p.slug === slug)!,
  );
  const archive = projects.filter((p) => p.status === 'Completed');
  const selectedProject = featured.find((p) => p.slug === lab);

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    function motion() {
      world.current.reducedMotion = media.matches;
      setReducedMotion(media.matches);
    }
    motion();
    media.addEventListener('change', motion);
    let disposed = false;
    import('@/lib/voxel-world')
      .then(async ({ createVoxelWorld }) => {
        await document.fonts.ready;
        if (disposed || !host.current) return;
        try {
          engine.current = createVoxelWorld(
            host.current,
            () => world.current,
            () => {
              engine.current?.dispose();
              engine.current = null;
              setUnavailable(true);
              onStatic?.();
            },
            (action) => sceneAction.current(action),
          );
          const created = engine.current;
          await created.ready;
          if (disposed || engine.current !== created) return;
          setReady(true);
          onReady?.();
        } catch {
          if (!disposed) {
            setUnavailable(true);
            onStatic?.();
          }
        }
      })
      .catch(() => {
        if (!disposed) {
          setUnavailable(true);
          onStatic?.();
        }
      });
    return () => {
      disposed = true;
      engine.current?.dispose();
      engine.current = null;
      media.removeEventListener('change', motion);
    };
  }, [onStatic, onReady]);

  useEffect(() => {
    let queued = 0;
    let offsets = sectionRefs.current.map((el) => el?.offsetTop ?? 0);
    function update(y: number) {
      const position = journeyPosition(
        y,
        offsets,
        host.current?.clientHeight || window.innerHeight,
        journeyExperience.length,
      );
      world.current.timeline = position.stop + position.phase;
      world.current.progress = position.progress;
      world.current.phase = position.phase;
      world.current.stop = position.stop;
      world.current.experience = position.experience;
      setActive(position.stop);
    }
    publishPosition.current = update;
    function measure() {
      queued = 0;
      offsets = sectionRefs.current.map((el) => el?.offsetTop ?? 0);
      update(scroll.current?.position() ?? window.scrollY);
    }
    function schedule() {
      if (!queued) queued = requestAnimationFrame(measure);
    }
    function native() {
      if (!scroll.current) update(window.scrollY);
    }
    window.addEventListener('scroll', native, { passive: true });
    window.addEventListener('resize', schedule);
    measure();
    const resize = new ResizeObserver(schedule);
    sectionRefs.current.forEach((el) => {
      if (el) resize.observe(el);
    });
    return () => {
      window.removeEventListener('scroll', native);
      window.removeEventListener('resize', schedule);
      resize.disconnect();
      cancelAnimationFrame(queued);
    };
  }, []);

  useEffect(() => {
    if (!ready || unavailable || !started) return;
    scroll.current = createJourneyScroll(
      () => sectionRefs.current.map((el) => el?.offsetTop ?? 0),
      journeyExperience.length,
      {
        viewport: () => host.current?.clientHeight || window.innerHeight,
        onPlayingChange: setTourPlaying,
        onPositionChange: (y, direct) => {
          if (direct) world.current.navigationRevision++;
          publishPosition.current(y);
        },
      },
    );
    if (!restored.current) {
      restored.current = true;
      const index = stations.findIndex(
        (station) => '#' + station.id === window.location.hash,
      );
      scroll.current.jump(
        index >= 0
          ? journeyOffset(
              { stop: index, phase: chapterEntryTimeline(index) - index },
              sectionRefs.current.map((el) => el?.offsetTop ?? 0),
              host.current?.clientHeight || window.innerHeight,
            )
          : 0,
      );
    }
    if (initialAutomatic) scroll.current.play();
    return () => {
      scroll.current?.dispose();
      scroll.current = null;
    };
  }, [ready, unavailable, started, initialAutomatic]);

  function travelTo(element: HTMLElement | null | undefined) {
    if (!element) return;
    const chapter = sectionRefs.current.indexOf(element);
    const y =
      chapter >= 0
        ? journeyOffset(
            { stop: chapter, phase: chapterEntryTimeline(chapter) - chapter },
            sectionRefs.current.map((el) => el?.offsetTop ?? 0),
            host.current?.clientHeight || window.innerHeight,
          )
        : element.getBoundingClientRect().top + window.scrollY;
    if (scroll.current) scroll.current.jump(y);
    else window.scrollTo({ top: y, behavior: 'smooth' });
  }

  useEffect(() => {
    world.current.onboard = mobile ? false : onboard;
    world.current.night = night;
    world.current.reading = mobile ? null : reading;
    world.current.mobile = mobile;
  }, [onboard, night, reading, mobile]);
  useEffect(
    () => () => {
      if (sound.current) {
        sound.current.pause();
        sound.current.removeAttribute('src');
        sound.current.load();
      }
    },
    [],
  );
  useEffect(() => {
    if (!lab) return;
    scroll.current?.pause();
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    labDialog.current?.showModal();
    closeLab.current?.focus();
    function key(event: KeyboardEvent) {
      if (event.key === 'Escape') setLab(null);
    }
    document.addEventListener('keydown', key);
    return () => {
      document.body.style.overflow = previous;
      document.removeEventListener('keydown', key);
      labTrigger.current?.focus();
    };
  }, [lab]);
  useEffect(() => {
    function key(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setRouteOpen(false);
        if (settingsMenu.current) settingsMenu.current.open = false;
      }
    }
    document.addEventListener('keydown', key);
    return () => document.removeEventListener('keydown', key);
  }, []);

  function goExperience(index: number) {
    world.current.reading = null;
    world.current.onboard = false;
    setReading(null);
    setOnboard(false);
    const section = sectionRefs.current[4];
    if (!section || !scroll.current) {
      travelTo(planetRefs.current[index]);
      return;
    }
    const start = section.offsetTop;
    const length =
      (sectionRefs.current[5]?.offsetTop ?? start + section.offsetHeight) -
      start;
    scroll.current.jump(
      start + length * experienceReadingPhase(index, journeyExperience.length),
    );
  }
  function go(index: number) {
    world.current.reading = null;
    world.current.onboard = false;
    setReading(null);
    setOnboard(false);
    travelTo(sectionRefs.current[index]);
    window.history.replaceState(
      null,
      '',
      index === 0 ? '/' : '#' + stations[index].id,
    );
    setRouteOpen(false);
  }
  useEffect(() => {
    sceneAction.current = (action) => {
      if (action.kind === 'project') setLab(action.slug);
      else if (action.kind === 'planet') {
        goExperience(action.index);
      } else window.location.assign('/blog');
    };
  }, [mobile, reducedMotion]);
  async function toggleSound() {
    if (!sound.current) return;
    sound.current.volume = 0.34;
    try {
      if (muted) await sound.current.play();
      else sound.current.pause();
      setMuted(!muted);
    } catch {
      setMuted(true);
    }
  }
  async function copyEmail() {
    try {
      await navigator.clipboard.writeText('psmithul@gmail.com');
      setCopied(true);
      setTimeout(() => setCopied(false), 2400);
    } catch {
      window.location.href = 'mailto:psmithul@gmail.com';
    }
  }

  return (
    <main
      id="main"
      onClickCapture={(event) => {
        if (
          event.target instanceof Element &&
          event.target.closest('button, a') &&
          !event.target.closest('[data-tour-control]')
        )
          scroll.current?.pause();
      }}
      className={
        'train-journey' +
        (active >= 4 ? ' in-space' : '') +
        (ready && !unavailable ? ' world-integrated' : '') +
        (mobile ? ' mobile-journey' : '') +
        (night ? ' world-night' : '') +
        (unavailable ? ' world-unavailable' : '')
      }
    >
      {/* oxlint-disable-next-line jsx-a11y/media-has-caption -- Original instrumental music contains no speech. */}
      <audio
        ref={sound}
        src="/audio/railway-theme.wav"
        loop
        preload="none"
        aria-hidden="true"
      />
      <div className="voxel-canvas" ref={host} />
      <div className="world-atmosphere" aria-hidden="true" />
      {unavailable && (
        <div className="world-fallback">
          The 3D journey needs WebGL. You can read every section below.
        </div>
      )}
      <div className="journey-tools">
        {tourPlaying && (
          <button
            className="journey-pause"
            data-tour-control=""
            onClick={() => scroll.current?.pause()}
          >
            <Pause size={15} aria-hidden="true" /> Pause tour
          </button>
        )}
        <details className="journey-settings" ref={settingsMenu}>
          <summary aria-label="Journey settings" title="Journey settings">
            <Settings2 size={18} aria-hidden="true" />
          </summary>
          <div className="journey-settings-menu">
            <p>Journey settings</p>
            <button
              data-tour-control=""
              onClick={() =>
                tourPlaying ? scroll.current?.pause() : scroll.current?.play()
              }
              disabled={!ready || unavailable}
              aria-pressed={tourPlaying}
            >
              {tourPlaying ? <Pause size={16} /> : <Play size={16} />}{' '}
              {tourPlaying ? 'Pause automatic tour' : 'Start automatic tour'}
            </button>
            <button
              onClick={() => {
                setReading(reading !== true);
                setOnboard(false);
              }}
              disabled={!ready || unavailable}
              aria-pressed={Boolean(reading)}
            >
              <BookOpen size={16} /> Read up close
            </button>
            <button
              onClick={() => {
                setOnboard(!onboard);
                setReading(false);
              }}
              disabled={!ready || unavailable}
              aria-pressed={onboard}
            >
              {active >= 4 ? <Truck size={16} /> : <TrainFront size={16} />}{' '}
              {onboard
                ? 'World camera'
                : active >= 4
                  ? 'Rover camera'
                  : 'Train camera'}
            </button>
            <button
              onClick={() => {
                engine.current?.resetView();
                setOnboard(false);
                setReading(null);
              }}
              disabled={!ready || unavailable}
            >
              <RotateCcw size={16} /> Reset camera
            </button>
            <button data-tour-control="" onClick={() => setNight(!night)}>
              {night ? <Sun size={16} /> : <Moon size={16} />}{' '}
              {night ? 'Daylight' : 'Moonlight'}
            </button>
            <button
              data-tour-control=""
              onClick={() => void toggleSound()}
              aria-pressed={!muted}
            >
              {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}{' '}
              {muted ? 'Play railway tune' : 'Mute railway tune'}
            </button>
          </div>
        </details>
      </div>

      <section
        id="home"
        className="journey-stop hero-stop"
        ref={(el) => {
          sectionRefs.current[0] = el;
        }}
        aria-labelledby="home-title"
      >
        <div className="hero-copy" data-world-board="0">
          <p className="world-eyebrow">
            MECHANICAL ENGINEERING · NITK SURATHKAL
          </p>
          <h1 id="home-title">Hi, I’m Mithul.</h1>
          <p className="hero-statement">
            Building and learning along the way, driven by an endless curiosity.
          </p>
          <p>
            I’m a final-year mechanical engineering student at NITK Surathkal. I
            like learning new technologies and using them to build things. I’m
            especially interested in robotics, control systems, and space.
          </p>
          <button className="pixel-button" onClick={() => go(1)}>
            About me <ArrowRight size={16} />
          </button>
          <p className="world-board-hint">
            <Mouse size={16} />{' '}
            {mobile
              ? tourPlaying
                ? 'Auto tour · swipe to pause · tap to explore'
                : 'Swipe to travel · Play for an automatic tour'
              : 'Scroll to travel · drag to look around'}
          </p>
        </div>
        <div className="hero-scroll">
          <Mouse size={15} />
          <span>{mobile ? 'Swipe to travel' : 'Scroll to travel'}</span>
          <ArrowDown size={13} />
        </div>
      </section>

      <section
        id="about"
        className="journey-stop"
        ref={(el) => {
          sectionRefs.current[1] = el;
        }}
        aria-labelledby="about-title"
      >
        <article className="station-panel about-panel" data-world-board="1">
          <div data-world-leaf>
            <p className="world-eyebrow">ABOUT · 01 / 03</p>
            <h2 id="about-title">A little about me.</h2>
            <div className="journey-portrait">
              <Image
                src="/images/mithul-cutout.webp"
                alt="Mithul, wearing glasses and a black shirt, looking to his right"
                width={1024}
                height={1536}
                unoptimized
              />
              <blockquote>
                Satisfaction of one&apos;s curiosity is one of the greatest
                sources of happiness in life
              </blockquote>
            </div>
          </div>
          <div data-world-leaf>
            <p className="world-eyebrow">ABOUT · 02 / 03</p>
            <p>
              I’m a final-year mechanical engineering student at NITK Surathkal.
              I like learning new things and using what I learn to build
              something. When an idea interests me, I want to understand how it
              works and how people came up with it.
            </p>
            <p>
              Right now, I’m working on a rover and a robot for collecting
              leaves, both meant to move over rough ground. I’m also exploring
              ways to make a mechanical joint more or less flexible.
            </p>
          </div>
          <div data-world-leaf>
            <p className="world-eyebrow">ABOUT · 03 / 03</p>
            <p>
              I like working on hard problems, even when I don’t know where to
              start. Building things helps me see what I’ve understood and what
              I still need to learn. I also love space and spend a lot of time
              reading about how we explore it.
            </p>
            <div className="inventory">
              <span>SolidWorks · ANSYS · MATLAB · Python · C / C++</span>
            </div>
            <a className="station-text-link" href="/about">
              Background & experience <ArrowUpRight size={15} />
            </a>
          </div>
        </article>
      </section>

      <section
        id="work"
        className="journey-stop"
        ref={(el) => {
          sectionRefs.current[2] = el;
        }}
        aria-labelledby="work-title"
      >
        <article className="station-panel project-panel" data-world-board="2">
          {featured.map((project, index) => (
            <div data-world-leaf key={project.slug}>
              <p className="world-eyebrow">PROJECTS · 0{index + 1} / 03</p>
              {index === 0 && (
                <>
                  <h2 id="work-title">Ongoing projects</h2>
                  <p>The projects I’m working on now.</p>
                </>
              )}
              <div className="voxel-project-card">
                <span className="project-number">0{index + 1}</span>
                <div>
                  <span className="project-discipline">
                    {project.discipline} · {project.period}
                  </span>
                  <h3>{shortProjectNames[project.slug]}</h3>
                  <p>{project.summary}</p>
                  <div className="project-actions">
                    <button
                      onClick={(event) => {
                        labTrigger.current = event.currentTarget;
                        setLab(project.slug);
                      }}
                    >
                      Explore model <Box size={13} />
                    </button>
                    <a
                      href={'/work/' + project.slug}
                      aria-label={'Read ' + project.title}
                    >
                      Case study <ArrowUpRight size={13} />
                    </a>
                  </div>
                </div>
              </div>
              {index === 2 && (
                <p className="station-footnote">
                  You can also click the models in the workshop. These are
                  interactive concept models.
                </p>
              )}
            </div>
          ))}
        </article>
      </section>

      <section
        id="archive"
        className="journey-stop archive-stop"
        ref={(el) => {
          sectionRefs.current[3] = el;
        }}
        aria-labelledby="archive-title"
      >
        <article className="station-panel archive-panel" data-world-board="3">
          {[0, 1, 2].map((page) => (
            <div data-world-leaf key={page}>
              <p className="world-eyebrow">SELECTED WORK · 0{page + 1} / 03</p>
              {page === 0 && (
                <>
                  <h2 id="archive-title">Past projects</h2>
                  <p>Some things I’ve built and explored.</p>
                </>
              )}
              <div className="journey-archive">
                {archive.slice(page * 3, page * 3 + 3).map((project, index) => (
                  <a href={'/work/' + project.slug} key={project.slug}>
                    <span className="archive-index">
                      {String(page * 3 + index + 1).padStart(2, '0')}
                    </span>
                    <div>
                      <h3>{project.title}</h3>
                      <span>
                        {project.discipline} · {project.period}
                      </span>
                    </div>
                    <ArrowUpRight size={15} />
                  </a>
                ))}
              </div>
              {page === 2 && (
                <p className="departure-note">
                  Keep scrolling to launch into experience.{' '}
                  <ArrowDown size={13} />
                </p>
              )}
            </div>
          ))}
        </article>
      </section>

      <section
        id="experience"
        className="journey-stop experience-stop"
        ref={(el) => {
          sectionRefs.current[4] = el;
        }}
        aria-label="Experience"
      >
        {journeyExperience.map((item, index) => (
          <article
            className="planet-chapter"
            key={item.company}
            ref={(el) => {
              planetRefs.current[index] = el;
            }}
            aria-labelledby={'planet-title-' + index}
          >
            <div
              className="station-panel experience-panel"
              data-world-board={4 + index}
            >
              <p className="world-eyebrow">
                LUNAR WORKSHOP · {String(index + 1).padStart(2, '0')} /{' '}
                {String(journeyExperience.length).padStart(2, '0')}
              </p>
              <h2 id={'planet-title-' + index}>{item.company}</h2>
              <p className="experience-role">{item.role}</p>
              <span className="project-discipline">
                {item.category} · {item.period}
              </span>
              <p>{item.description}</p>
              {'href' in item && (
                <a className="station-text-link" href={item.href}>
                  Internship case study <ArrowUpRight size={15} />
                </a>
              )}
              <nav className="planet-selector" aria-label="Experience chapters">
                {journeyExperience.map((p, i) => (
                  <button
                    key={p.company}
                    onClick={() => {
                      goExperience(i);
                    }}
                    aria-current={i === index ? 'step' : undefined}
                    aria-label={'Go to ' + p.company}
                    title={p.company}
                  >
                    {String(i + 1).padStart(2, '0')}
                  </button>
                ))}
              </nav>
              {index === journeyExperience.length - 1 && (
                <a className="station-text-link" href="/about">
                  Full background & leadership <ArrowUpRight size={15} />
                </a>
              )}
            </div>
          </article>
        ))}
      </section>

      <section
        id="journal"
        className="journey-stop"
        ref={(el) => {
          sectionRefs.current[5] = el;
        }}
        aria-labelledby="journal-title"
      >
        <article className="station-panel journal-station" data-world-board="9">
          <div data-world-leaf>
            <p className="world-eyebrow">JOURNAL</p>
            <h2 id="journal-title">Mika’s Life.</h2>
            <p>
              Things I’ve been reading about, trying out, and still figuring
              out.
            </p>
            <div className="station-posts">
              {posts.slice(0, 2).map((post) => (
                <a key={post.slug} href={'/blog/' + post.slug}>
                  <div>
                    <span>
                      {post.category} · {post.readingMinutes} min
                    </span>
                    <h3>{post.title}</h3>
                  </div>
                  <ArrowUpRight size={16} />
                </a>
              ))}
            </div>
            <a href="/blog" className="station-text-link">
              Read more in Journal <BookOpen size={16} />
              <ArrowRight size={15} />
            </a>
          </div>
        </article>
      </section>

      <section
        id="contact"
        className="journey-stop contact-stop"
        ref={(el) => {
          sectionRefs.current[6] = el;
        }}
        aria-labelledby="contact-title"
      >
        <article className="station-panel contact-panel" data-world-board="10">
          <p className="world-eyebrow">CONTACT</p>
          <h2 id="contact-title">Get in touch.</h2>
          <p>
            Have a project in mind or a question about the work? I’d like to
            hear from you.
          </p>
          <a className="pixel-button" href="mailto:psmithul@gmail.com">
            Email me <Mail size={16} />
            <ArrowUpRight size={15} />
          </a>
          <div className="contact-email">
            <span>psmithul@gmail.com</span>
            <button
              onClick={() => void copyEmail()}
              aria-label="Copy email address"
            >
              {copied ? <Check size={15} /> : <Copy size={15} />}
            </button>
            <output>{copied ? 'Copied!' : ''}</output>
          </div>
          <div className="contact-socials">
            <a
              href="https://github.com/psmithul"
              target="_blank"
              rel="noreferrer"
            >
              GitHub <ArrowUpRight size={14} />
            </a>
            <a
              href="https://www.linkedin.com/in/psmithulsourav"
              target="_blank"
              rel="noreferrer"
            >
              LinkedIn <ArrowUpRight size={14} />
            </a>
            <a href="/Mithul-Sourav-CV.pdf" target="_blank" rel="noreferrer">
              Résumé <ArrowUpRight size={14} />
            </a>
          </div>
          <button className="station-text-link" onClick={() => go(0)}>
            Back to the railway <RotateCcw size={15} />
          </button>
          <a className="writing-desk-link" href="/write">
            Writing desk
          </a>
        </article>
      </section>

      <nav className="journey-navigation" aria-label="Journey chapters">
        {stations.map((stop, index) => (
          <button
            key={stop.id}
            onClick={() => go(index)}
            aria-current={active === index ? 'step' : undefined}
            aria-label={'Chapter ' + (index + 1) + ': ' + stop.name}
            title={stop.name}
          >
            <span />
            <span className="nav-stop-label">{stop.name}</span>
          </button>
        ))}
      </nav>
      <button
        className="route-toggle"
        onClick={() => setRouteOpen(!routeOpen)}
        aria-expanded={routeOpen}
        aria-controls="route-menu"
      >
        <Map size={14} />
        <span>Menu</span>
      </button>
      {routeOpen && (
        <nav className="route-menu" id="route-menu" aria-label="Route map">
          <div>
            <span className="world-eyebrow">JUMP TO</span>
            <button
              onClick={() => setRouteOpen(false)}
              aria-label="Close route map"
            >
              <X size={17} />
            </button>
          </div>
          {stations.map((stop, index) => (
            <button key={stop.id} onClick={() => go(index)}>
              <span>0{index + 1}</span>
              <strong>{stop.name}</strong>
              <ArrowRight size={15} />
            </button>
          ))}
        </nav>
      )}
      {selectedProject && (
        <dialog
          ref={labDialog}
          className="workshop-overlay"
          onCancel={() => setLab(null)}
          aria-labelledby="workshop-title"
        >
          <section className="workshop-dialog">
            <div className="workshop-dialog-head">
              <div>
                <span className="world-eyebrow">
                  THE WORKSHOP · INTERACTIVE CONCEPT
                </span>
                <h2 id="workshop-title">
                  {shortProjectNames[selectedProject.slug]}
                </h2>
              </div>
              <button
                ref={closeLab}
                onClick={() => setLab(null)}
                aria-label="Close model"
              >
                <X size={22} />
              </button>
            </div>
            <EngineeringPlayground
              key={selectedProject.slug}
              initialModel={
                projectModel[selectedProject.slug as keyof typeof projectModel]
              }
              compact
            />
            <div className="workshop-dialog-foot">
              <p>{selectedProject.question}</p>
              <a href={'/work/' + selectedProject.slug}>
                Read the case study <ArrowUpRight size={16} />
              </a>
            </div>
          </section>
        </dialog>
      )}
    </main>
  );
}
