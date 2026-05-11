import { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Dialog, DialogTitle, DialogBody } from '@/components/dialog';
import { Badge } from '@/components/badge';
import { Heading } from '@/components/heading';
import { Text } from '@/components/text';
import { Button } from '@/components/button';
import { formatDistance, formatPace, formatDuration } from '@/lib/format';
import type { DetailedActivity, StreamSet } from '@/types/strava';

interface ActivityDrawerProps {
  activity: DetailedActivity | undefined;
  streams: StreamSet | undefined;
  inMiles: boolean;
  onClose: () => void;
}

export function ActivityDrawer({ activity, streams, inMiles, onClose }: ActivityDrawerProps) {
  const hasHR = streams?.heartrate?.data != null && streams.heartrate.data.length > 0;
  const hasAltitude = streams?.altitude?.data != null && streams.altitude.data.length > 0;

  const hrChartData = useMemo(() => {
    if (!hasHR) return [];
    const hrData = streams!.heartrate!.data;
    const timeData = streams!.time?.data ?? Array(hrData.length).fill(0);
    return hrData.map((hr, i) => ({ time: Math.round(timeData[i] / 1000), hr }));
  }, [hasHR, streams]);

  const altChartData = useMemo(() => {
    if (!hasAltitude || !streams?.time?.data) return [];
    const data = streams.altitude!.data;
    const timeData = streams.time.data;
    return data.map((alt, i) => ({ time: Math.round(timeData[i] / 1000), alt }));
  }, [hasAltitude, streams]);

  if (!activity) return null;

  const date = new Date(activity.start_date_local);
  const distFormatted = formatDistance(activity.distance, inMiles);
  const pace = activity.sport_type === 'Run' ? formatPace(activity.distance, activity.moving_time, inMiles) : '--';
  const elevation = activity.total_elevation_gain > 0 ? `${activity.total_elevation_gain}m` : '--';

  return (
    <Dialog open={true} onClose={onClose}>
      <div className="flex items-center justify-between">
        <DialogTitle className="text-xl/7 font-semibold text-zinc-950 sm:text-lg/6 dark:text-white">{activity.name}</DialogTitle>
        <Button plain onClick={onClose} aria-label="Close">Close</Button>
      </div>
      <DialogBody>
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <Text className="text-zinc-500 uppercase tracking-wide text-xs">Date</Text>
            <p className="text-sm font-medium text-zinc-950 dark:text-white mt-1">
              {date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
            </p>
          </div>
          <div>
            <Text className="text-zinc-500 uppercase tracking-wide text-xs">Type</Text>
            <div className="mt-1">
              <Badge color="blue">{activity.sport_type}</Badge>
            </div>
          </div>
          <div>
            <Text className="text-zinc-500 uppercase tracking-wide text-xs">Distance</Text>
            <p className="text-sm font-medium text-zinc-950 dark:text-white mt-1">{distFormatted}</p>
          </div>
          <div>
            <Text className="text-zinc-500 uppercase tracking-wide text-xs">Time</Text>
            <p className="text-sm font-medium text-zinc-950 dark:text-white mt-1">{formatDuration(activity.moving_time)}</p>
          </div>
          <div>
            <Text className="text-zinc-500 uppercase tracking-wide text-xs">Pace</Text>
            <p className="text-sm font-medium text-zinc-950 dark:text-white mt-1">{pace}</p>
          </div>
          <div>
            <Text className="text-zinc-500 uppercase tracking-wide text-xs">Elevation</Text>
            <p className="text-sm font-medium text-zinc-950 dark:text-white mt-1">{elevation}</p>
          </div>
          {activity.average_heartrate != null && (
            <div>
              <Text className="text-zinc-500 uppercase tracking-wide text-xs">Avg HR</Text>
              <p className="text-sm font-medium text-zinc-950 dark:text-white mt-1">{Math.round(activity.average_heartrate)} bpm</p>
            </div>
          )}
          {activity.max_heartrate != null && (
            <div>
              <Text className="text-zinc-500 uppercase tracking-wide text-xs">Max HR</Text>
              <p className="text-sm font-medium text-zinc-950 dark:text-white mt-1">{Math.round(activity.max_heartrate)} bpm</p>
            </div>
          )}
          {activity.suffer_score != null && (
            <div>
              <Text className="text-zinc-500 uppercase tracking-wide text-xs">Suffer Score</Text>
              <p className="text-sm font-medium text-zinc-950 dark:text-white mt-1">{activity.suffer_score}</p>
            </div>
          )}
          {activity.calories != null && (
            <div>
              <Text className="text-zinc-500 uppercase tracking-wide text-xs">Calories</Text>
              <p className="text-sm font-medium text-zinc-950 dark:text-white mt-1">{Math.round(activity.calories)}</p>
            </div>
          )}
        </div>

        {hasHR && hrChartData.length > 0 && (
          <div className="mt-4">
            <Heading level={3}>Heart Rate</Heading>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={hrChartData} margin={{ top: 8, right: 16, bottom: 8, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-zinc-200 dark:text-zinc-800" />
                <XAxis dataKey="time" tickFormatter={(s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`} tick={{ fontSize: 11, fill: 'currentColor', className: 'text-zinc-400' }} />
                <YAxis domain={[100, 'auto']} tick={{ fontSize: 11, fill: 'currentColor', className: 'text-zinc-400' }} />
                <Tooltip contentStyle={{ backgroundColor: 'var(--bg, white)', border: '1px solid var(--border, #e5e4e7)', borderRadius: 8, fontSize: 13 }} />
                <Line type="monotone" dataKey="hr" name="Heart Rate (bpm)" stroke="#ef4444" strokeWidth={2} dot={false} isAnimationActive={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {hasAltitude && altChartData.length > 0 && (
          <div className="mt-6">
            <Heading level={3}>Elevation</Heading>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={altChartData} margin={{ top: 8, right: 16, bottom: 8, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-zinc-200 dark:text-zinc-800" />
                <XAxis dataKey="time" tickFormatter={(s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`} tick={{ fontSize: 11, fill: 'currentColor', className: 'text-zinc-400' }} />
                <YAxis domain={['auto', 'auto']} tick={{ fontSize: 11, fill: 'currentColor', className: 'text-zinc-400' }} />
                <Tooltip contentStyle={{ backgroundColor: 'var(--bg, white)', border: '1px solid var(--border, #e5e4e7)', borderRadius: 8, fontSize: 13 }} />
                <Line type="monotone" dataKey="alt" name="Altitude (m)" stroke="#6366f1" strokeWidth={2} dot={false} isAnimationActive={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {activity.description && (
          <div className="mt-6">
            <Heading level={3}>Description</Heading>
            <Text className="mt-2 whitespace-pre-wrap">{activity.description}</Text>
          </div>
        )}
      </DialogBody>
    </Dialog>
  );
}
