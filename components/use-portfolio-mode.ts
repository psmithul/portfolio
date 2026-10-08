'use client';

import { useSyncExternalStore } from 'react';
import {
  portfolioModeForDevice,
  type PortfolioMode,
} from '@/lib/portfolio-display';

// Resizing a window or rotating a device must not replace the whole page.
const subscribe = () => () => {};

function snapshot() {
  return portfolioModeForDevice(navigator);
}

export function usePortfolioMode(initialMode: PortfolioMode | null = null) {
  return useSyncExternalStore(subscribe, snapshot, () => initialMode);
}
