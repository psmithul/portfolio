export type PortfolioMode = 'static' | 'desktop';

type Device = {
  userAgent: string;
  platform?: string;
  maxTouchPoints?: number;
};

// Device identity keeps the phone page stable through rotation and gives
// tablets (including iPadOS's desktop user agent) the full journey.
export function portfolioModeForDevice({
  userAgent,
  platform = '',
  maxTouchPoints = 0,
}: Device): PortfolioMode {
  if (
    /iPad/i.test(userAgent) ||
    (platform === 'MacIntel' && maxTouchPoints > 1)
  )
    return 'desktop';
  if (
    /iPhone|iPod|Windows Phone|IEMobile|Opera Mini/i.test(userAgent + platform)
  )
    return 'static';
  if (/Android/i.test(userAgent) && /\bMobile\b/i.test(userAgent))
    return 'static';
  return 'desktop';
}
