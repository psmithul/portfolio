'use client';

import {
  Component,
  useCallback,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import dynamic from 'next/dynamic';
import type { Project } from '@/content/projects';
import type { JournalSummary } from '@/lib/journal-editorial';
import { MinecraftLoader } from '@/components/minecraft-loader';
import { usePortfolioMode } from '@/components/use-portfolio-mode';
import type { PortfolioMode } from '@/lib/portfolio-display';

// Only mount (and fetch) the desktop bundle after checking the device.
// The server-rendered reading version stays independent of Three.js.
const DesktopJourney = dynamic(
  () =>
    import('@/components/train-journey').then((module) => module.TrainJourney),
  { ssr: false, loading: () => <main id="main" /> },
);

class SceneBoundary extends Component<
  { children: ReactNode; onFailure: () => void },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch() {
    this.props.onFailure();
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

export function PortfolioExperience({
  children,
  projects,
  posts,
  initialMode,
}: {
  children: ReactNode;
  projects: Project[];
  posts: JournalSummary[];
  initialMode: PortfolioMode;
}) {
  const mode = usePortfolioMode(initialMode);
  const [preferStatic, setPreferStatic] = useState(false);
  const showStatic = preferStatic || mode !== 'desktop';
  const readStatic = useCallback(() => setPreferStatic(true), []);

  useEffect(() => {
    if (!showStatic || mode === null) return;
    let disposed = false;
    const restore = () => {
      if (disposed) return;
      const id = window.location.hash.slice(1);
      if (id)
        document.getElementById(id)?.scrollIntoView({ behavior: 'instant' });
    };
    void document.fonts.ready.then(restore);
    return () => {
      disposed = true;
    };
  }, [showStatic, mode]);

  if (!showStatic)
    return (
      <DesktopExperience
        projects={projects}
        posts={posts}
        onStatic={readStatic}
      />
    );

  return <div className="portfolio-entry">{children}</div>;
}

function DesktopExperience({
  projects,
  posts,
  onStatic,
}: {
  projects: Project[];
  posts: JournalSummary[];
  onStatic: () => void;
}) {
  const [sceneReady, setSceneReady] = useState(false);
  const [travel, setTravel] = useState<'manual' | 'automatic' | null>(null);
  const loaded = useCallback(() => setSceneReady(true), []);
  const loading = !sceneReady || travel === null;
  return (
    <>
      <div
        className={loading ? 'desktop-scene-loading' : undefined}
        inert={loading}
      >
        <SceneBoundary onFailure={onStatic}>
          <DesktopJourney
            projects={projects}
            posts={posts}
            onStatic={onStatic}
            onReady={loaded}
            started={travel !== null}
            initialAutomatic={travel === 'automatic'}
          />
        </SceneBoundary>
      </div>
      {loading && (
        <MinecraftLoader
          label={
            sceneReady ? 'Your journey is ready.' : 'Preparing your journey…'
          }
          onStatic={onStatic}
          ready={sceneReady}
        >
          <fieldset className="travel-choice">
            <legend>How would you like to travel?</legend>
            <div className="travel-choice-options">
              <button
                aria-pressed={travel === 'manual'}
                onClick={() => setTravel('manual')}
              >
                At my pace
              </button>
              <button
                aria-pressed={travel === 'automatic'}
                onClick={() => setTravel('automatic')}
              >
                Automatic
              </button>
            </div>
            <p className="travel-choice-status" aria-live="polite">
              {travel === null
                ? sceneReady
                  ? 'Choose to begin.'
                  : 'You can choose while it loads.'
                : `${travel === 'manual' ? 'Manual' : 'Automatic'} selected. Loading…`}
            </p>
          </fieldset>
        </MinecraftLoader>
      )}
    </>
  );
}
