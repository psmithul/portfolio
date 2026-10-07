'use client';

import { useSyncExternalStore } from 'react';
import { staticPortfolioQuery } from '@/lib/portfolio-display';

function subscribe(change: () => void) {
  const media = window.matchMedia(staticPortfolioQuery);
  media.addEventListener('change', change);
  return () => media.removeEventListener('change', change);
}

function snapshot() {
  return window.matchMedia(staticPortfolioQuery).matches ? 'static' : 'desktop';
}

export function usePortfolioMode() {
  return useSyncExternalStore(subscribe, snapshot, () => null);
}
