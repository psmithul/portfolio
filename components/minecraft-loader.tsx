import type { ReactNode } from 'react';

export function MinecraftLoader({
  label = 'Preparing your journey…',
  compact = false,
  onStatic,
  children,
  ready = false,
}: {
  label?: string;
  compact?: boolean;
  onStatic?: () => void;
  children?: ReactNode;
  ready?: boolean;
}) {
  return (
    <div
      className={
        'minecraft-loader' +
        (compact ? ' loader-compact' : '') +
        (ready ? ' loader-ready' : '')
      }
    >
      <div className="loader-inner">
        <span className="sr-only">Mithul</span>
        <svg
          className="loader-wordmark"
          viewBox="0 0 488 112"
          aria-hidden="true"
          fill="currentColor"
        >
          <path d="M0 8h24v12h8v12h16V20h8V8h24v96H56V56h-8v16H32V56h-8v48H0Z" />
          <path d="M96 8h24v96H96Z" />
          <path d="M136 8h72v24h-24v72h-24V32h-24Z" />
          <path d="M224 8h24v36h28V8h24v96h-24V68h-28v36h-24Z" />
          <path d="M316 8h24v72h28V8h24v84h-12v12h-52V92h-12Z" />
          <path d="M408 8h24v72h56v24h-80Z" />
        </svg>
        <div className="loader-bar" aria-hidden="true">
          <span />
        </div>
        <output className="loader-status" aria-live="polite" aria-atomic="true">
          <span className="loader-title">{label}</span>
        </output>
        {children}
        {onStatic && (
          <button className="loader-static-link" onClick={onStatic}>
            Read the lightweight version →
          </button>
        )}
      </div>
    </div>
  );
}
