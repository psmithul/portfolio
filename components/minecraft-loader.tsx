import { PixelLandscape } from '@/components/pixel-landscape';
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
        <span className="loader-eyebrow">MITHUL SOURAV · LOADING</span>
        <div className="loader-landscape">
          <PixelLandscape small />
        </div>
        <div className="loader-track" aria-hidden="true">
          <span />
        </div>
        <output className="loader-status" aria-live="polite" aria-atomic="true">
          <span className="loader-title">{label}</span>
          <span className="loader-subtitle">One block at a time.</span>
        </output>
        {children}
        {!compact && (
          <p className="loader-desktop-note">
            <span className="loader-mobile-message">
              A lighter, scrollable portfolio for your phone.{' '}
            </span>
            Open psmithul.com on a computer to explore the full 3D train
            journey.
          </p>
        )}
        {onStatic && (
          <button className="loader-static-link" onClick={onStatic}>
            Read the lightweight version →
          </button>
        )}
      </div>
    </div>
  );
}
