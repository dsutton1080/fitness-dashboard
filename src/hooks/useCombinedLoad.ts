import { useMemo } from 'react';
import { useReadiness, useSleep } from '@/hooks/useOura';
import { useRecentActivities } from '@/hooks/useStrava';
import { rangeForDays } from '@/lib/dates';

export function useCombinedLoad() {
  const range = useMemo(() => rangeForDays(30), []);
  const readiness = useReadiness(range);
  const sleepDetail = useSleep(range);
  const activities = useRecentActivities(30);

  const combined = useMemo(() => {
    const readinessData = readiness.data ?? [];
    const sleepData = sleepDetail.data ?? [];
    const actData = activities.data ?? [];

    // Build daily suffer_score from Strava activities
    const sufferByDay = new Map<string, number>();
    for (const act of actData) {
      if (act.suffer_score != null) {
        const day = act.start_date_local.split('T')[0];
        sufferByDay.set(day, (sufferByDay.get(day) ?? 0) + act.suffer_score);
      }
    }

    // Merge by day for 30-day window
    const days: Array<{
      date: string;
      readiness_score: number | null;
      hrv: number | null;
      suffer_score: number;
    }> = [];

    for (let i = 29; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dayStr = d.toISOString().split('T')[0];

      const readinessEntry = readinessData.find((r) => r.day === dayStr);
      const sleepEntry = sleepData.find((s) => s.day === dayStr);

      days.push({
        date: dayStr,
        readiness_score: readinessEntry?.score ?? null,
        hrv: sleepEntry?.average_hrv ?? null,
        suffer_score: sufferByDay.get(dayStr) ?? 0,
      });
    }

    return days;
  }, [readiness.data, sleepDetail.data, activities.data]);

  return {
    readiness,
    sleepDetail,
    activities,
    combined,
  };
}
