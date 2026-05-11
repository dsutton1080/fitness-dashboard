export const queryKeys = {
  readiness: (range: { start: string; end: string }) => ['oura', 'readiness', range] as const,
  sleep: (range: { start: string; end: string }) => ['oura', 'sleep', range] as const,
  sleepDetail: (range: { start: string; end: string }) => ['oura', 'sleep_detail', range] as const,
  activity: (range: { start: string; end: string }) => ['oura', 'activity', range] as const,
  stress: (range: { start: string; end: string }) => ['oura', 'stress', range] as const,
  workouts: ['oura', 'workouts'] as const,

  athlete: ['strava', 'athlete'] as const,
  stats: (id: number) => ['strava', 'stats', id] as const,
  activities: (count: number) => ['strava', 'activities', count] as const,
  activityDetail: (id: number) => ['strava', 'activity_detail', id] as const,
  streams: (id: number) => ['strava', 'streams', id] as const,
  zones: ['strava', 'zones'] as const,

  combinedLoad: ['combined', 'load'] as const,
} as const;
