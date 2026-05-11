import { useMemo } from 'react';
import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Heading } from '@/components/heading';

interface CombinedDay {
  date: string;
  readiness_score: number | null;
  hrv: number | null;
  suffer_score: number;
}

interface LoadVsRecoveryCardProps {
  data: CombinedDay[];
  className?: string;
}

export function LoadVsRecoveryCard({ data, className }: LoadVsRecoveryCardProps) {
  const chartData = useMemo(() => {
    return data.map((d) => ({
      date: d.date.slice(5),
      suffer_score: d.suffer_score,
      readiness: d.readiness_score ?? 0,
      hrv: d.hrv ?? 0,
    }));
  }, [data]);

  if (chartData.length === 0) {
    return (
      <div className={`rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 shadow-sm ${className ?? ''}`}>
        <Heading level={2}>Training Load vs Recovery</Heading>
        <p className="text-zinc-500 mt-4">No data available.</p>
      </div>
    );
  }

  return (
    <div className={`rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 shadow-sm ${className ?? ''}`}>
      <Heading level={2}>Training Load vs Recovery</Heading>
      <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">30-day window: suffer score (bars) with readiness and HRV (lines)</p>
      <div className="mt-4">
        <ResponsiveContainer width="100%" height={300}>
          <ComposedChart data={chartData} margin={{ top: 8, right: 24, bottom: 8, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-zinc-200 dark:text-zinc-800" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 11, fill: 'currentColor', className: 'text-zinc-400' }}
              tickCount={10}
            />
            <YAxis
              yAxisId="left"
              domain={[0, 'auto']}
              tick={{ fontSize: 12, fill: 'currentColor', className: 'text-zinc-400' }}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              domain={[0, 100]}
              tick={{ fontSize: 12, fill: 'currentColor', className: 'text-zinc-400' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'var(--bg, white)',
                border: '1px solid var(--border, #e5e4e7)',
                borderRadius: 8,
                fontSize: 13,
                boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
              }}
            />
            <Legend />
            <Bar
              yAxisId="left"
              dataKey="suffer_score"
              name="Suffer Score"
              fill="#6366f1"
              radius={[4, 4, 0, 0]}
              opacity={0.7}
            />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="readiness"
              name="Readiness"
              stroke="#10b981"
              strokeWidth={2}
              dot={false}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="hrv"
              name="HRV (ms)"
              stroke="#f59e0b"
              strokeWidth={2}
              dot={false}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
