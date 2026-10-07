import { exhibitReadingPhases } from './journey-exhibits.ts';
import { experienceReadingPhase } from './journey-choreography.ts';

export function journeyTourStops(experienceCount: number) {
  const stops: { timeline: number; hold: number }[] = [
    { timeline: 0, hold: 12 },
  ];
  for (const board of [1, 2, 3])
    for (const phase of exhibitReadingPhases(board))
      stops.push({ timeline: board + phase, hold: board === 2 ? 11 : 9 });
  for (let i = 0; i < experienceCount; i++)
    stops.push({
      timeline: 4 + experienceReadingPhase(i, experienceCount),
      hold: 8,
    });
  for (const phase of exhibitReadingPhases(9))
    stops.push({ timeline: 5 + phase, hold: 9 });
  stops.push({ timeline: 6, hold: 10 });
  return stops;
}

/** Reading time starts after arrival, never while the train or guide is moving. */
export function createJourneyTour(experienceCount: number) {
  const stops = journeyTourStops(experienceCount);
  let index = 0,
    elapsed = 0,
    playing = false;
  return {
    playing: () => playing,
    target: () => stops[index].timeline,
    play(timeline: number) {
      const next = stops.findIndex((stop) => stop.timeline >= timeline - 0.025);
      index = next < 0 ? 0 : next;
      elapsed = 0;
      playing = true;
    },
    pause() {
      playing = false;
    },
    skip(timeline: number, direction: -1 | 1) {
      const next =
        direction > 0
          ? stops.findIndex((stop) => stop.timeline > timeline + 0.025)
          : stops.findLastIndex((stop) => stop.timeline < timeline - 0.025);
      index = next < 0 ? (direction > 0 ? stops.length - 1 : 0) : next;
      elapsed = 0;
    },
    step(arrived: boolean, seconds: number) {
      if (!playing || !arrived) return;
      // A background tab or stalled frame cannot consume a reading pause.
      elapsed += Math.min(0.05, Math.max(0, seconds));
      if (elapsed + 1e-8 < stops[index].hold) return;
      elapsed = 0;
      if (index === stops.length - 1) playing = false;
      else index++;
    },
  };
}

/** Navigation lands at the first readable composition, never in its arrival sequence. */
export function chapterEntryTimeline(chapter: number, count = 5) {
  return (
    journeyTourStops(count).find(
      (stop) => Math.floor(stop.timeline) === chapter,
    )?.timeline ?? chapter
  );
}
