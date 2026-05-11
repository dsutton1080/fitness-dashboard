import { useMemo } from 'react';
import { Badge } from '@/components/badge';
import { Heading } from '@/components/heading';
import type { SummaryActivity } from '@/types/strava';
import { formatDistance, formatPace, formatDuration } from '@/lib/format';

interface ActivitiesTableCardProps {
  activities: SummaryActivity[];
  inMiles: boolean;
  onActivityClick: (id: number) => void;
  className?: string;
}

function effortColor(score: number | null): 'green' | 'amber' | 'red' | 'zinc' {
  if (score == null || score === 0) return 'zinc';
  if (score >= 150) return 'red';
  if (score >= 100) return 'amber';
  if (score >= 50) return 'green';
  return 'zinc';
}

function activityTypeBadge(type: string): string {
  const map: Record<string, string> = {
    Run: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
    Ride: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300',
    VirtualRun: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
  };
  return map[type] ?? 'bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-300';
}

export function ActivitiesTableCard({ activities, inMiles, onActivityClick, className }: ActivitiesTableCardProps) {
  const recent = useMemo(() => {
    return [...activities]
      .sort((a, b) => new Date(b.start_date).getTime() - new Date(a.start_date).getTime())
      .slice(0, 10);
  }, [activities]);

  if (recent.length === 0) {
    return (
      <div className={`rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 shadow-sm ${className ?? ''}`}>
        <Heading level={2}>Recent Activities</Heading>
        <p className="text-zinc-500 mt-4">No activities yet.</p>
      </div>
    );
  }

  const headers = ['Date', 'Type', 'Name', 'Distance', 'Time', 'Pace', 'Avg HR', 'Effort', ''];

  return (
    <div className={`rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 shadow-sm ${className ?? ''}`}>
      <Heading level={2}>Recent Activities</Heading>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-zinc-200 dark:border-zinc-800">
              {headers.map((h) => (
                <th key={h} className="text-left py-2 px-3 text-zinc-500 dark:text-zinc-400 uppercase tracking-wide text-xs font-medium">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {recent.map((act) => {
              const date = new Date(act.start_date_local);
              const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
              const distFormatted = formatDistance(act.distance, inMiles);
              const pace = act.sport_type === 'Run' ? formatPace(act.distance, act.moving_time, inMiles) : '--';
              const timeFormatted = formatDuration(act.moving_time);
              const hrFormatted = act.average_heartrate != null ? `${act.average_heartrate}` : '--';
              const effortVal = act.suffer_score;
              const effortBadgeColor = effortColor(effortVal);

              return (
                <tr
                  key={act.id}
                  className={`even:bg-zinc-50 dark:even:bg-zinc-950/30 cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-800/50 transition-colors`}
                  onClick={() => onActivityClick(act.id)}
                >
                  <td className="py-2.5 px-3 tabular-nums text-zinc-950 dark:text-white">{dateStr}</td>
                  <td className="py-2.5 px-3">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${activityTypeBadge(act.type)}`}>
                      {act.sport_type}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 tabular-nums text-zinc-950 dark:text-white font-medium">{act.name}</td>
                  <td className="py-2.5 px-3 tabular-nums text-zinc-950 dark:text-white">{distFormatted}</td>
                  <td className="py-2.5 px-3 tabular-nums text-zinc-950 dark:text-white">{timeFormatted}</td>
                  <td className="py-2.5 px-3 tabular-nums text-zinc-950 dark:text-white">{pace}</td>
                  <td className="py-2.5 px-3 tabular-nums text-zinc-950 dark:text-white">{hrFormatted}</td>
                  <td className="py-2.5 px-3">
                    {effortVal != null ? (
                      <Badge color={effortBadgeColor}>{effortVal}</Badge>
                    ) : (
                      <span className="text-zinc-400">-</span>
                    )}
                  </td>
                  <td className="py-2.5 px-3 text-zinc-400">&rsaquo;</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
