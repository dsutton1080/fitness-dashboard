import { LineChart, Line, ResponsiveContainer } from 'recharts';
import { Badge } from '@/components/badge';
import { Text } from '@/components/text';

interface SparklineData {
  date: string;
  value: number | null;
}

interface StatCardProps {
  label: string;
  value: string | number;
  delta?: { value: number; pct: string } | null;
  sparkline: SparklineData[];
  className?: string;
  unit?: string;
}

export function StatCard({ label, value, delta, sparkline, className, unit }: StatCardProps) {
  const sparklineColor = delta?.value != null && delta.value >= 0 ? '#10b981' : '#ef4444';

  return (
    <div className={`rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 shadow-sm ${className ?? ''}`}>
      <Text className="text-zinc-500 dark:text-zinc-400 uppercase tracking-wide mb-2">
        {label}
      </Text>
      <div className="flex items-end justify-between">
        <div>
          <p className="text-4xl font-semibold tabular-nums text-zinc-950 dark:text-white">
            {value}{unit ? <span className="text-lg font-normal text-zinc-500 ml-1">{unit}</span> : null}
          </p>
          {delta != null && (
            <Badge color={delta.value >= 0 ? 'green' : 'red'} className="mt-2">
              {delta.value >= 0 ? '+' : ''}{delta.pct}% vs 7d avg
            </Badge>
          )}
        </div>
        {sparkline.length > 0 && (
          <div className="h-7 w-24 ml-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={sparkline}>
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke={sparklineColor}
                  strokeWidth={1.5}
                  dot={false}
                  isAnimationActive={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
}
