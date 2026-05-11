import { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Heading } from '@/components/heading';
import type { PublicDailyReadiness } from '@/types/oura';
import type { PublicModifiedSleepModel } from '@/types/oura';

interface TrendsCardProps {
  readinessData: PublicDailyReadiness[];
  sleepData: PublicModifiedSleepModel[];
  className?: string;
}

export function TrendsCard({ readinessData, sleepData, className }: TrendsCardProps) {
  const chartData = useMemo(() => {
    const map = new Map<string, { date: string; readiness: number | null; sleep: number | null; hrv: number | null }>();

    for (const r of readinessData) {
      const existing = map.get(r.day) ?? { date: r.day, readiness: null, sleep: null, hrv: null };
      existing.readiness = r.score;
      map.set(r.day, existing);
    }

    for (const s of sleepData) {
      const existing = map.get(s.day) ?? { date: s.day, readiness: null, sleep: null, hrv: null };
      existing.sleep = s.efficiency;
      existing.hrv = s.average_hrv;
      map.set(s.day, existing);
    }

    return Array.from(map.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([, v]) => v);
  }, [readinessData, sleepData]);

  const sorted = useMemo(() => {
    return [...chartData].sort((a, b) => a.date.localeCompare(b.date));
  }, [chartData]);

  if (sorted.length === 0) {
    return <div className={`rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 shadow-sm ${className ?? ''}`}>
      <Heading level={2}>30-Day Trends</Heading>
      <p className="text-zinc-500 mt-4">No data available yet.</p>
    </div>;
  }

  return (
    <div className={`rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 shadow-sm ${className ?? ''}`}>
      <Heading level={2}>30-Day Trends</Heading>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={sorted} margin={{ top: 8, right: 24, bottom: 8, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-zinc-200 dark:text-zinc-800" />
          <XAxis
            dataKey="date"
            tickFormatter={(d: string) => d.slice(5)}
            tick={{ fontSize: 12, fill: 'currentColor', className: 'text-zinc-400' }}
            tickMargin={8}
            tickCount={7}
          />
          <YAxis domain={[0, 100]} tick={{ fontSize: 12, fill: 'currentColor', className: 'text-zinc-400' }} />
          <Tooltip
            contentStyle={{
              backgroundColor: 'var(--bg, white)',
              border: '1px solid var(--border, #e5e4e7)',
              borderRadius: 8,
              fontSize: 13,
              boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
            }}
          />
          <Line
            type="monotone"
            dataKey="readiness"
            name="Readiness"
            stroke="#10b981"
            strokeWidth={2}
            dot={false}
            isAnimationActive={false}
            aria-label="Readiness score over 30 days"
          />
          <Line
            type="monotone"
            dataKey="sleep"
            name="Sleep Efficiency"
            stroke="#6366f1"
            strokeWidth={2}
            dot={false}
            isAnimationActive={false}
            aria-label="Sleep efficiency over 30 days"
          />
          <Line
            type="monotone"
            dataKey="hrv"
            name="HRV (ms)"
            stroke="#f59e0b"
            strokeWidth={2}
            dot={false}
            isAnimationActive={false}
            yAxisId="hrv"
            aria-label="HRV over 30 days"
          />
          <YAxis yAxisId="hrv" domain={['auto', 'auto']} tick={{ fontSize: 12 }} hide />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
