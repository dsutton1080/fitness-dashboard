import type {
  DetailedAthlete,
  ActivityStats,
  SummaryActivity,
  DetailedActivity,
  StreamSet,
  Zones as StravaZones,
} from '@/types/strava';

async function loadMock<T>(fileName: string): Promise<T> {
  const mod = await import(`@/mocks/strava/${fileName}.json`);
  return mod.default as T;
}

export async function fetchAthlete(): Promise<DetailedAthlete> {
  if (import.meta.env.DEV && !import.meta.env.VITE_USE_PROXY) {
    return loadMock('athlete');
  }
  const res = await fetch('/api/strava/athlete');
  if (!res.ok) throw new Error(`Strava API error: ${res.status}`);
  return res.json() as Promise<DetailedAthlete>;
}

export async function fetchStats(athleteId: number | undefined): Promise<ActivityStats> {
  if (!athleteId) return loadMock('stats');
  if (import.meta.env.DEV && !import.meta.env.VITE_USE_PROXY) {
    return loadMock('stats');
  }
  const res = await fetch(`/api/strava/athletes/${athleteId}/stats`);
  if (!res.ok) throw new Error(`Strava API error: ${res.status}`);
  return res.json() as Promise<ActivityStats>;
}

export async function fetchActivities(perPage = 30): Promise<SummaryActivity[]> {
  if (import.meta.env.DEV && !import.meta.env.VITE_USE_PROXY) {
    const raw = await loadMock('activities');
    return raw as SummaryActivity[];
  }
  const res = await fetch(`/api/strava/athlete/activities?per_page=${perPage}`);
  if (!res.ok) throw new Error(`Strava API error: ${res.status}`);
  return res.json() as Promise<SummaryActivity[]>;
}

export async function fetchActivityDetail(activityId: number): Promise<DetailedActivity> {
  if (import.meta.env.DEV && !import.meta.env.VITE_USE_PROXY) {
    return (await loadMock<DetailedActivity>('activity_12345')) as DetailedActivity;
  }
  const res = await fetch(`/api/strava/activities/${activityId}`);
  if (!res.ok) throw new Error(`Strava API error: ${res.status}`);
  return res.json() as Promise<DetailedActivity>;
}

export async function fetchStreams(activityId: number): Promise<StreamSet> {
  if (import.meta.env.DEV && !import.meta.env.VITE_USE_PROXY) {
    return loadMock('streams_12345');
  }
  const res = await fetch(`/api/strava/activities/${activityId}/streams?keys=time,distance,heartrate,velocity_smooth,altitude&key_by_type=true`);
  if (!res.ok) throw new Error(`Strava API error: ${res.status}`);
  return res.json() as Promise<StreamSet>;
}

export async function fetchZones(): Promise<StravaZones> {
  if (import.meta.env.DEV && !import.meta.env.VITE_USE_PROXY) {
    return loadMock('zones');
  }
  const res = await fetch('/api/strava/athlete/zones');
  if (!res.ok) throw new Error(`Strava API error: ${res.status}`);
  return res.json() as Promise<StravaZones>;
}
