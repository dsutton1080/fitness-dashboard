import {
  subDays,
  format,
  startOfWeek,
  eachWeekOfInterval,
  parseISO,
  endOfWeek,
} from 'date-fns';

export function rangeForDays(n: number): { start: string; end: string } {
  const end = format(new Date(), 'yyyy-MM-dd');
  const start = format(subDays(new Date(), n - 1), 'yyyy-MM-dd');
  return { start, end };
}

export function weekBucketsForActivities(
  activities: Array<{ start_date_local: string; distance: number }>,
  weeks: number
): Array<{ label: string; meters: number }> {
  if (activities.length === 0) {
    return Array.from({ length: weeks }, (_, i) => ({
      label: `Week ${weeks - i}`,
      meters: 0,
    }));
  }

  const endDate = endOfWeek(new Date(), { weekStartsOn: 0 });
  const startDate = startOfWeek(subDays(endDate, weeks * 7), { weekStartsOn: 0 });

  const weekLabels = eachWeekOfInterval(
    { start: startDate, end: endDate },
    { weekStartsOn: 0 }
  ).map((w) => format(w, 'MMM d'));

  return weekLabels.map((_label, i) => {
    const weekEnd = subDays(endDate, (weeks - 1 - i) * 7);
    const weekStart = startOfWeek(weekEnd, { weekStartsOn: 0 });
    const weekMeters = activities
      .filter((a) => {
        const d = parseISO(a.start_date_local);
        return d >= weekStart && d <= weekEnd;
      })
      .reduce((sum, a) => sum + a.distance, 0);

    return {
      label: `W${i + 1}`,
      meters: +(weekMeters / 1000).toFixed(1),
    };
  });
}

export function groupByDay<T extends { day: string }>(items: T[]): Map<string, T[]> {
  const map = new Map<string, T[]>();
  for (const item of items) {
    const existing = map.get(item.day) ?? [];
    existing.push(item);
    map.set(item.day, existing);
  }
  return map;
}
