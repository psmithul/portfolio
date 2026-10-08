'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { MinecraftLoader } from '@/components/minecraft-loader';
import { Box, Pause, Play, RotateCcw, Scan, Layers3, Hand } from 'lucide-react';
import type {
  ModelKind,
  SceneOptions,
  EngineeringScene,
} from '@/lib/engineering-scene';

const models: {
  id: ModelKind;
  name: string;
  subtitle: string;
  note: string;
}[] = [
  {
    id: 'rover',
    name: 'Rover',
    subtitle: 'Six wheels. A little curiosity.',
    note: 'Rough-terrain rover · variable-stiffness suspension',
  },
  {
    id: 'tensegrity',
    name: 'Tensegrity',
    subtitle: 'Held together by tension.',
    note: 'Variable-stiffness joint · geometry & member forces',
  },
  {
    id: 'collection',
    name: 'Leaf collector',
    subtitle: 'Leaves in. Soil stays out.',
    note: 'Pickup drum, transfer belt, and collection hopper · conceptual architecture',
  },
  {
    id: 'linkage',
    name: 'Four-bar linkage',
    subtitle: 'Four links. One connected motion.',
    note: 'Circle-intersection kinematics keep the crank, coupler, and rocker connected.',
  },
  {
    id: 'electronics',
    name: 'Isolation mount',
    subtitle: 'A softer path for vibration.',
    note: 'Base-excited spring–mass–damper concept · illustrative normalized units',
  },
  {
    id: 'navigation',
    name: 'Mobile robot',
    subtitle: 'Finding a way through.',
    note: 'Mobile robot and obstacle layout · conceptual motion, not the project simulator',
  },
  {
    id: 'solar',
    name: 'Solar smart home',
    subtitle: 'A little light. A connected home.',
    note: 'Solar panel, sensor board, and household lights · illustrative power response',
  },
  {
    id: 'transit',
    name: 'Elevated transit',
    subtitle: 'Room for a different way through.',
    note: 'Elevated bus and sequenced signals · illustrative model, not the original circuit',
  },
  {
    id: 'wallet',
    name: 'Sliding mechanism',
    subtitle: 'Small geometry. Easier access.',
    note: 'Card translation and layered assembly · conceptual mechanism',
  },
  {
    id: 'knee',
    name: 'KneeAssist',
    subtitle: 'Assistance, when it is needed.',
    note: 'Actuated brace · cable-and-spring assistance',
  },
  {
    id: 'satellite',
    name: 'Reaction wheel',
    subtitle: 'Small vibrations travel far.',
    note: 'Satellite panel · reaction wheel & camera interface',
  },
];

export function EngineeringPlayground({
  initialModel = 'rover',
  compact = false,
  enabled = true,
}: {
  initialModel?: ModelKind;
  compact?: boolean;
  enabled?: boolean;
}) {
  const host = useRef<HTMLElement>(null);
  const engine = useRef<EngineeringScene | null>(null);
  const [model, setModel] = useState<ModelKind>(initialModel);
  const [running, setRunning] = useState(false);
  const [exploded, setExploded] = useState(false);
  const [stiffness, setStiffness] = useState(1);
  const [terrain, setTerrain] = useState(0.45);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState('');
  const options = useRef<SceneOptions>({
    model: initialModel,
    running: false,
    exploded: false,
    stiffness: 1,
    terrain: 0.45,
  });
  const active = models.find((item) => item.id === model)!;

  useEffect(() => {
    options.current = { model, running, exploded, stiffness, terrain };
  }, [model, running, exploded, stiffness, terrain]);

  useEffect(() => {
    if (!enabled) return;
    let cancelled = false;
    import('@/lib/engineering-scene')
      .then(({ createEngineeringScene }) => {
        if (cancelled || !host.current) return;
        engine.current = createEngineeringScene(
          host.current,
          () => options.current,
          {
            onReady() {
              if (!cancelled) setReady(true);
            },
            onError(message) {
              setError(message);
              setReady(false);
            },
          },
        );
      })
      .catch((cause: unknown) => {
        if (!cancelled)
          setError(
            cause instanceof Error
              ? cause.message
              : 'The 3D viewer could not start.',
          );
      });
    return () => {
      cancelled = true;
      engine.current?.dispose();
      engine.current = null;
    };
  }, [enabled]);

  function reset() {
    setRunning(false);
    setExploded(false);
    setStiffness(1);
    setTerrain(0.45);
    engine.current?.resetView();
  }

  return (
    <section
      className={`engineering-playground ${compact ? 'playground-compact' : ''}`}
      aria-label="Interactive engineering concept models"
    >
      {!compact && (
        <div className="model-selector" aria-label="Choose a model">
          {models.map((item) => (
            <button
              key={item.id}
              type="button"
              aria-pressed={model === item.id}
              onClick={() => {
                setModel(item.id);
                setExploded(false);
              }}
            >
              {item.name}
            </button>
          ))}
        </div>
      )}
      <div className="playground-stage">
        <div className="stage-title">
          <span className="eyebrow">
            THE WORKBENCH /{' '}
            {String(models.findIndex((item) => item.id === model) + 1).padStart(
              2,
              '0',
            )}
          </span>
          <p>{active.subtitle}</p>
        </div>
        <figure
          className="scene-host"
          ref={host}
          aria-label={`Interactive 3D concept of ${active.name}. Use the controls below to animate, expand or rotate it.`}
        />
        {!ready && !error && (
          <div className="scene-loading">
            <MinecraftLoader label="Setting up the workbench…" compact />
          </div>
        )}
        {error && (
          <output className="scene-error">
            <Box size={38} />
            <p>3D is unavailable in this browser.</p>
            <Link href="#project-notes">Continue to the write-up ↓</Link>
          </output>
        )}
        <div className="stage-orientation" aria-hidden="true">
          <span>Y</span>
          <i />
          <b>X</b>
          <em>Z</em>
        </div>
        <div className="stage-hint">
          <Hand size={14} />
          <span>Drag to orbit · pinch to zoom</span>
        </div>
        <div className="stage-toolbar">
          <button
            type="button"
            disabled={!ready}
            aria-pressed={running}
            onClick={() => setRunning(!running)}
          >
            {running ? <Pause size={16} /> : <Play size={16} />}
            <span>{running ? 'Pause' : 'Set in motion'}</span>
          </button>
          <button
            type="button"
            disabled={!ready}
            aria-pressed={exploded}
            onClick={() => setExploded(!exploded)}
          >
            <Layers3 size={16} />
            <span>{exploded ? 'Assemble' : 'Pull apart'}</span>
          </button>
          <button
            type="button"
            disabled={!ready}
            aria-label="Rotate view 45 degrees"
            onClick={() => engine.current?.rotateView()}
          >
            <Scan size={16} />
            <span className="toolbar-secondary">Orbit</span>
          </button>
          <button
            type="button"
            disabled={!ready}
            aria-label="Reset model and camera"
            onClick={reset}
          >
            <RotateCcw size={16} />
          </button>
        </div>
      </div>
      <div className="workbench-controls">
        <div>
          <span className="eyebrow">
            {model === 'rover' || model === 'electronics'
              ? 'SUSPENSION'
              : model === 'collection' ||
                  model === 'transit' ||
                  model === 'linkage' ||
                  model === 'navigation'
                ? 'DRIVE SPEED'
                : model === 'wallet'
                  ? 'ASSEMBLY'
                  : model === 'solar'
                    ? 'SUNLIGHT'
                    : model === 'tensegrity'
                      ? 'JOINT GEOMETRY'
                      : model === 'knee'
                        ? 'ASSISTANCE'
                        : 'WHEEL SPEED'}
          </span>
          <div className="stiffness-buttons">
            {['Soft', 'Medium', 'Stiff'].map((label, index) => (
              <button
                key={label}
                type="button"
                disabled={!ready}
                aria-pressed={stiffness === index}
                onClick={() => setStiffness(index)}
              >
                {model === 'satellite' || model === 'solar'
                  ? ['Low', 'Mid', 'High'][index]
                  : model === 'wallet'
                    ? ['Stacked', 'Offset', 'Fanned'][index]
                    : model === 'collection' ||
                        model === 'linkage' ||
                        model === 'navigation' ||
                        model === 'transit'
                      ? ['Slow', 'Medium', 'Fast'][index]
                      : model === 'knee'
                        ? ['Gentle', 'Medium', 'Firm'][index]
                        : model === 'tensegrity'
                          ? ['Open', 'Mid', 'Twisted'][index]
                          : label}
              </button>
            ))}
          </div>
        </div>
        {model === 'rover' || model === 'collection' ? (
          <label className="terrain-control">
            <span className="eyebrow">TERRAIN</span>
            <input
              disabled={!ready}
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={terrain}
              onChange={(event) => setTerrain(Number(event.target.value))}
              aria-label="Terrain roughness"
            />
            <span>
              {terrain < 0.3 ? 'Smooth' : terrain < 0.7 ? 'Uneven' : 'Rough'}
            </span>
          </label>
        ) : (
          <p className="model-control-note">{active.note}</p>
        )}
      </div>
      <p className="concept-caption">
        Interactive concept models. Geometry and motion illustrate the ideas;
        they are not project CAD or measured results.
      </p>
    </section>
  );
}
