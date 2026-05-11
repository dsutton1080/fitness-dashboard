

import type { PublicDailyReadiness } from '@/types/oura';

interface ContributorRow {
  label: string;
  value: number | null;
}

const contributorFields: Array<{ key: keyof NonNullable<PublicDailyReadiness['contributors']>; label: string }> = [
  { key: 'recovery_index', label: 'Recovery Index' },
  { key: 'sleep_balance', label: 'Sleep Balance' },
  { key: 'sleep_regularity', label: 'Sleep Regularity' },
  { key: 'hrv_balance', label: 'HRV Balance' },
  { key: 'body_temperature', label: 'Body Temp' },
  { key: 'activity_balance', label: 'Activity Balance' },
  { key: 'previous_day_activity', label: 'Previous Day Activity' },
  { key: 'previous_night', label: 'Previous Night' },
  { key: 'resting_heart_rate', label: 'Resting Heart Rate' },
];

interface ContributorsCardProps {
  readinessData: PublicDailyReadiness[];
  className?: string;
}

export function ContributorsCard({ readinessData, className }: ContributorsCardProps) {
  const today = readinessData[0];

  if (!today || !today.contributors) {
    return (
      <div className={`rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 shadow-sm ${className ?? ''}`}>
        <h2 className="text-lg font-semibold text-zinc-950 dark:text-white">Readiness Contributors</h2>
        <p className="text-zinc-500 mt-4">No data available.</p>
      </div>
    );
  }

  const rows: ContributorRow[] = contributorFields
    .map((f) => ({
      label: f.label,
      value: today.contributors[f.key],
    }))
    .filter((r) => r.value != null) as ContributorRow[];

  return (
    <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 shadow-sm" data-testid="contributors-card">
      <h2 className="text-lg font-semibold text-zinc-950 dark:text-white" data-testid="contributors-title">Readiness Contributors</h2>
      <div className="mt-4 space-y-3" data-testid="contributors-list">
        {rows.map((row) => (
          <div key={row.label} className="space-y-1" data-testid="contributor-row">
            <div className="flex items-center justify-between text-sm">
              <span className="text-zinc-500 dark:text-zinc-400">{row.label}</span>
              <span className="tabular-nums text-zinc-950 dark:text-white font-medium">{String(row.value)}</span>
            </div>
            <div className="h-2 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500 dark:bg-emerald-400 rounded-full transition-all"
                style={{ width: `${Math.min(Math.max(row.value ?? 0, 0), 100)}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
