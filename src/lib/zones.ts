import type { Zones, Stream } from '@/types/strava';

export interface ZoneBucket {
  label: string;
  seconds: number;
  color: string;
}

export function computeTimeInZone(
  heartrateStream: Stream<number> | undefined,
  zones: Zones
): ZoneBucket[] {
  if (!heartrateStream || !heartrateStream.data.length) {
    return [];
  }

  const zoneRanges = zones.heart_rate.zones;
  const buckets: number[] = Array(zoneRanges.length).fill(0);

  heartrateStream.data.forEach((hr) => {
    for (let i = zoneRanges.length - 1; i >= 0; i--) {
      if (i === 0 && hr <= zoneRanges[i].max) {
        buckets[i]++;
        break;
      }
      if (hr > zoneRanges[i].min && hr <= zoneRanges[i].max) {
        buckets[i]++;
        break;
      }
    }
  });

  const colors = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6'];
  const labels = zoneRanges.map((z) => `${z.min}-${z.max}`);

  return buckets.map((count, i) => ({
    label: labels[i],
    seconds: count,
    color: colors[i] ?? '#6b7280',
  }));
}
