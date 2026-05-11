import { useQuery } from '@tanstack/react-query';
import { fetchReadiness, fetchSleep, fetchSleepDetail, fetchActivity, fetchStress, fetchWorkouts } from '@/api/oura';
import { queryKeys } from '@/api/queryKeys';

export function useReadiness(range: { start: string; end: string }) {
  return useQuery({
    queryKey: queryKeys.readiness(range),
    queryFn: () => fetchReadiness(range.start, range.end),
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: 2,
  });
}

export function useDailySleep(range: { start: string; end: string }) {
  return useQuery({
    queryKey: queryKeys.sleep(range),
    queryFn: () => fetchSleep(range.start, range.end),
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: 2,
  });
}

export function useSleep(range: { start: string; end: string }) {
  return useQuery({
    queryKey: queryKeys.sleepDetail(range),
    queryFn: () => fetchSleepDetail(range.start, range.end),
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: 2,
  });
}

export function useDailyActivity(range: { start: string; end: string }) {
  return useQuery({
    queryKey: queryKeys.activity(range),
    queryFn: () => fetchActivity(range.start, range.end),
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: 2,
  });
}

export function useStress(range: { start: string; end: string }) {
  return useQuery({
    queryKey: queryKeys.stress(range),
    queryFn: () => fetchStress(range.start, range.end),
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: 2,
  });
}

export function useWorkouts() {
  return useQuery({
    queryKey: queryKeys.workouts,
    queryFn: fetchWorkouts,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: 2,
  });
}
