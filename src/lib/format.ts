export function formatDistance(meters: number, inMiles: boolean): string {
  if (inMiles) {
    const miles = meters * 0.000621371;
    return `${miles.toFixed(2)} mi`;
  }
  const km = meters / 1000;
  return `${km.toFixed(2)} km`;
}

export function formatPace(meters: number, seconds: number, inMiles: boolean): string {
  if (seconds === 0 || meters === 0) return '--';
  const distanceInMiles = meters * 0.000621371;
  const distanceInKm = meters / 1000;
  const dist = inMiles ? distanceInMiles : distanceInKm;
  if (dist === 0) return '--';
  const pacePerUnit = seconds / dist;
  const mins = Math.floor(pacePerUnit / 60);
  const secs = Math.round(pacePerUnit % 60);
  const unit = inMiles ? 'mi' : 'km';
  return `${mins}:${secs.toString().padStart(2, '0')} /${unit}`;
}

export function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.round(seconds % 60);
  if (h > 0) {
    return `${h}h ${m.toString().padStart(2, '0')}m ${s}s`;
  }
  return `${m}m ${s.toString().padStart(2, '0')}s`;
}

export function formatDelta(current: number | null, previous: number | null): { value: number; pct: string } | null {
  if (current == null || previous == null || previous === 0) return null;
  const diff = current - previous;
  const pct = ((diff / previous) * 100).toFixed(1);
  return { value: diff, pct };
}

export function formatDeltaPercent(current: number | null, previous: number | null): string {
  if (current == null || previous == null || previous === 0) return '';
  const diff = current - previous;
  const pct = ((diff / previous) * 100).toFixed(1);
  const sign = diff >= 0 ? '+' : '';
  return `${sign}${pct}%`;
}
