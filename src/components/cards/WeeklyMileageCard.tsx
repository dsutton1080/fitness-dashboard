import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { Heading } from '@/components/heading';
import { Text } from '@/components/text';
import type { SummaryActivity } from '@/types/strava';
import { weekBucketsForActivities } from '@/lib/dates';



interface StravaTotalsCardProps {
  runDistanceYtd: number;
  runCountYtd: number;
  runDistanceAll: number;
  runCountAll: number;
  inMiles?: boolean;
  className?: string;
}

export function StravaTotalsCard({ runDistanceYtd, runCountYtd, runDistanceAll, runCountAll, inMiles = true, className }: StravaTotalsCardProps) {
  const ytdDistance = inMiles ? (runDistanceYtd * 0.000621371).toFixed(1) : (runDistanceYtd / 1000).toFixed(1);
  const allDistance = inMiles ? (runDistanceAll * 0.000621371).toFixed(1) : (runDistanceAll / 1000).toFixed(1);
  const unit = inMiles ? 'mi' : 'km';

  return (
    <div className={`rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 shadow-sm ${className ?? ''}`}>
      <Heading level={2}>Run Totals</Heading>
      <div className="mt-4 space-y-4">
        <div>
          <Text className="text-zinc-500 dark:text-zinc-400 uppercase tracking-wide text-sm">This Year</Text>
          <p className="text-3xl font-semibold tabular-nums text-zinc-950 dark:text-white mt-1">{ytdDistance}</p>
          <Text className="text-zinc-500 text-sm">{unit} in {runCountYtd} runs</Text>
        </div>
        <div className="border-t border-zinc-200 dark:border-zinc-800" />
        <div>
          <Text className="text-zinc-500 dark:text-zinc-400 uppercase tracking-wide text-sm">All Time</Text>
          <p className="text-3xl font-semibold tabular-nums text-zinc-950 dark:text-white mt-1">{allDistance}</p>
          <Text className="text-zinc-500 text-sm">{unit} in {runCountAll} runs</Text>
        </div>
      </div>
    </div>
  );
}

interface WeeklyMileageCardProps {
  activities: SummaryActivity[];
  inMiles?: boolean;
  className?: string;
}

const GOAL_MILES = 25;
const GOAL_KM = 40;

export function WeeklyMileageCard({ activities, inMiles = true, className }: WeeklyMileageCardProps) {
  const DATA_WEEKS = 12;
  const goal = inMiles ? GOAL_MILES : GOAL_KM;
  const unit = inMiles ? 'mi' : 'km';

  const data = useMemo(() => {
    const buckets = weekBucketsForActivities(activities, DATA_WEEKS);
    return buckets.map((b) => ({
      label: b.label,
      miles: inMiles ? +(b.meters * 0.621371).toFixed(1) : +(b.meters * 1.60934).toFixed(1),
    }));
  }, [activities, inMiles]);

  return (
    <div className={`rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 shadow-sm ${className ?? ''}`}>
      <Heading level={2}>Weekly Mileage</Heading>
      <Text className="text-zinc-500 dark:text-zinc-400 mt-1 text-sm">Last {DATA_WEEKS} weeks (run only)</Text>
      <div className="mt-4">
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={data} margin={{ top: 8, right: 16, bottom: 8, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-zinc-200 dark:text-zinc-800" vertical={false} />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 12, fill: 'currentColor', className: 'text-zinc-400' }}
              tickLine={{ stroke: 'currentColor', className: 'text-zinc-200 dark:text-zinc-800' }}
              axisLine={{ stroke: 'currentColor', className: 'text-zinc-200 dark:text-zinc-800' }}
            />
            <YAxis
              tick={{ fontSize: 12, fill: 'currentColor', className: 'text-zinc-400' }}
              tickLine={{ stroke: 'currentColor', className: 'text-zinc-200 dark:text-zinc-800' }}
              axisLine={{ stroke: 'currentColor', className: 'text-zinc-200 dark:text-zinc-800' }}
            />
            <Tooltip
              formatter={(value) => [`${Number(value).toFixed(1)} ${unit}`, unit === 'mi' ? 'Miles' : 'Km']}
              contentStyle={{
                backgroundColor: 'var(--bg, white)',
                border: '1px solid var(--border, #e5e4e7)',
                borderRadius: 8,
                fontSize: 13,
                boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
              }}
            />
            <ReferenceLine y={goal} stroke="#ef4444" strokeDasharray="4 4" label={{ position: 'insideTopRight', value: `${goal} ${unit}`, fill: 'currentColor', className: 'text-zinc-500', fontSize: 11 }} />
            <Bar
              dataKey="miles"
              fill="#aa3bff"
              radius={[6, 6, 0, 0]}
              style={{ filter: 'saturate(1.2)' }}
              aria-label={`Weekly mileage chart with ${data.length} data points`}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
