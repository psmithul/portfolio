import { test } from 'node:test';
import assert from 'node:assert/strict';
import { portfolioModeForDevice } from '../lib/portfolio-display.ts';

await test('phones receive the document portfolio in either orientation', () => {
  for (const userAgent of [
    'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 Mobile/15E148 Safari/604.1',
    'Mozilla/5.0 (Linux; Android 15; Pixel 9) AppleWebKit/537.36 Chrome/131.0.0.0 Mobile Safari/537.36',
    'Mozilla/5.0 (Linux; Android 14; SM-S921B) AppleWebKit/537.36 SamsungBrowser/26.0 Mobile Safari/537.36',
  ]) {
    // Width is deliberately absent: rotating or opening a phone's browser
    // toolbar cannot replace its page with the WebGL journey.
    assert.equal(portfolioModeForDevice({ userAgent }), 'static');
    assert.equal(
      portfolioModeForDevice({ userAgent, maxTouchPoints: 5 }),
      'static',
    );
  }
});

await test('iPads keep the full journey with mobile and desktop user agents', () => {
  assert.equal(
    portfolioModeForDevice({
      userAgent:
        'Mozilla/5.0 (iPad; CPU OS 18_0 like Mac OS X) AppleWebKit/605.1.15 Mobile/15E148 Safari/604.1',
    }),
    'desktop',
  );
  assert.equal(
    portfolioModeForDevice({
      userAgent:
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15) AppleWebKit/605.1.15 Version/18.0 Safari/605.1.15',
      platform: 'MacIntel',
      maxTouchPoints: 5,
    }),
    'desktop',
  );
});

await test('Android tablets, touch laptops and narrow desktop windows keep the journey', () => {
  for (const device of [
    {
      userAgent:
        'Mozilla/5.0 (Linux; Android 14; SM-X710) AppleWebKit/537.36 Chrome/131.0.0.0 Safari/537.36',
      maxTouchPoints: 10,
    },
    {
      userAgent:
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/131.0.0.0 Safari/537.36',
      platform: 'Win32',
      maxTouchPoints: 10,
    },
    {
      userAgent:
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15) AppleWebKit/605.1.15 Version/18.0 Safari/605.1.15',
      platform: 'MacIntel',
      maxTouchPoints: 0,
    },
  ])
    assert.equal(portfolioModeForDevice(device), 'desktop');
});
