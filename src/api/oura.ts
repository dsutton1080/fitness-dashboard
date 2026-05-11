import type {
  PublicDailyReadiness,
  PublicDailySleep,
  PublicModifiedSleepModel,
  PublicDailyActivity,
  PublicDailyStress,
  PublicWorkout,
} from '@/types/oura';

async function loadMock<T>(fileName: string): Promise<T> {
  const mod = await import(`@/mocks/oura/${fileName}.json`);
  return mod.default as T;
}

function filterByRange<T extends { day: string }>(data: unknown[], start: string, end: string): T[] {
  return (data as T[]).filter((d) => d.day >= start && d.day <= end);
}

export async function fetchReadiness(start: string, end: string): Promise<PublicDailyReadiness[]> {
  if (import.meta.env.DEV && !import.meta.env.VITE_USE_PROXY) {
    const raw = await loadMock<PublicDailyReadiness[]>('daily_readiness');
    return filterByRange(raw, start, end);
  }
  const res = await fetch(`/api/oura/daily_readiness?start_date=${start}&end_date=${end}`);
  if (!res.ok) throw new Error(`Oura API error: ${res.status}`);
  const json = await res.json();
  return json.data as PublicDailyReadiness[];
}

export async function fetchSleep(start: string, end: string): Promise<PublicDailySleep[]> {
  if (import.meta.env.DEV && !import.meta.env.VITE_USE_PROXY) {
    const raw = await loadMock<PublicDailySleep[]>('daily_sleep');
    return filterByRange(raw, start, end);
  }
  const res = await fetch(`/api/oura/daily_sleep?start_date=${start}&end_date=${end}`);
  if (!res.ok) throw new Error(`Oura API error: ${res.status}`);
  const json = await res.json();
  return json.data as PublicDailySleep[];
}

export async function fetchSleepDetail(start: string, end: string): Promise<PublicModifiedSleepModel[]> {
  if (import.meta.env.DEV && !import.meta.env.VITE_USE_PROXY) {
    const raw = await loadMock<PublicModifiedSleepModel[]>('sleep');
    return filterByRange(raw, start, end);
  }
  const res = await fetch(`/api/oura/sleep?start_date=${start}&end_date=${end}`);
  if (!res.ok) throw new Error(`Oura API error: ${res.status}`);
  const json = await res.json();
  return json.data as PublicModifiedSleepModel[];
}

export async function fetchActivity(start: string, end: string): Promise<PublicDailyActivity[]> {
  if (import.meta.env.DEV && !import.meta.env.VITE_USE_PROXY) {
    const raw = await loadMock<PublicDailyActivity[]>('daily_activity');
    return filterByRange(raw, start, end);
  }
  const res = await fetch(`/api/oura/daily_activity?start_date=${start}&end_date=${end}`);
  if (!res.ok) throw new Error(`Oura API error: ${res.status}`);
  const json = await res.json();
  return json.data as PublicDailyActivity[];
}

export async function fetchStress(start: string, end: string): Promise<PublicDailyStress[]> {
  if (import.meta.env.DEV && !import.meta.env.VITE_USE_PROXY) {
    const raw = await loadMock<PublicDailyStress[]>('daily_stress');
    return filterByRange(raw, start, end);
  }
  const res = await fetch(`/api/oura/daily_stress?start_date=${start}&end_date=${end}`);
  if (!res.ok) throw new Error(`Oura API error: ${res.status}`);
  const json = await res.json();
  return json.data as PublicDailyStress[];
}

export async function fetchWorkouts(): Promise<PublicWorkout[]> {
  if (import.meta.env.DEV && !import.meta.env.VITE_USE_PROXY) {
    return loadMock<PublicWorkout[]>('workout');
  }
  const res = await fetch('/api/oura/workout');
  if (!res.ok) throw new Error(`Oura API error: ${res.status}`);
  const json = await res.json();
  return json.data as PublicWorkout[];
}
