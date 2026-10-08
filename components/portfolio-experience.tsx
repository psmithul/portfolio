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

// Only mount (and fetch) the desktop bundle after checking the viewport.
// The server-rendered reading version stays independent of Three.js.
const DesktopJourney = dynamic(
  () =>
    import('@/components/train-journey').then((module) => module.TrainJourney),
  { ssr: false, loading: () => null },
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
}: {
  children: ReactNode;
  projects: Project[];
  posts: JournalSummary[];
}) {
  const mode = usePortfolioMode();
  const [preferStatic, setPreferStatic] = useState(false);
  const [fontsReady, setFontsReady] = useState(false);
  const showStatic = preferStatic || mode !== 'desktop';
  const readStatic = useCallback(() => setPreferStatic(true), []);

  useEffect(() => {
    if (!showStatic || mode === null) return;
    let disposed = false;
    void document.fonts.ready.then(() => {
      if (!disposed) setFontsReady(true);
    });
    return () => {
      disposed = true;
    };
  }, [showStatic, mode]);

  useEffect(() => {
    if (!showStatic || !fontsReady) return;
    const frame = requestAnimationFrame(() => {
      const id = window.location.hash.slice(1);
      if (id)
        document.getElementById(id)?.scrollIntoView({ behavior: 'instant' });
    });
    return () => cancelAnimationFrame(frame);
  }, [showStatic, fontsReady]);

  if (!showStatic)
    return (
      <DesktopExperience
        projects={projects}
        posts={posts}
        onStatic={readStatic}
      />
    );

  return (
    <div
      className={
        'portfolio-entry' + (!fontsReady ? ' portfolio-preparing' : '')
      }
    >
      {children}
      {!fontsReady && (
        <div className="portfolio-loading-shell">
          <MinecraftLoader label="Preparing your portfolio…" />
        </div>
      )}
      <noscript>
        <style>
          {
            '.portfolio-loading-shell{display:none}.portfolio-preparing .static-portfolio{visibility:visible}'
          }
        </style>
      </noscript>
    </div>
  );
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
