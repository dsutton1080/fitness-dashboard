import { useQuery } from '@tanstack/react-query';
import { fetchAthlete, fetchStats, fetchActivities, fetchActivityDetail, fetchStreams, fetchZones } from '@/api/strava';
import { queryKeys } from '@/api/queryKeys';

export function useAthlete() {
  return useQuery({
    queryKey: queryKeys.athlete,
    queryFn: fetchAthlete,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: 2,
  });
}

export function useStats(athleteId: number | undefined) {
  return useQuery({
    queryKey: athleteId ? queryKeys.stats(athleteId) : [],
    queryFn: () => fetchStats(athleteId!),
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: 2,
    enabled: !!athleteId,
  });
}

export function useRecentActivities(count = 30) {
  return useQuery({
    queryKey: queryKeys.activities(count),
    queryFn: () => fetchActivities(count),
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: 2,
  });
}

export function useActivityDetail(activityId: number) {
  return useQuery({
    queryKey: queryKeys.activityDetail(activityId),
    queryFn: () => fetchActivityDetail(activityId),
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: 2,
    enabled: !!activityId,
  });
}

export function useStreams(activityId: number) {
  return useQuery({
    queryKey: queryKeys.streams(activityId),
    queryFn: () => fetchStreams(activityId),
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: 2,
    enabled: !!activityId,
  });
}

export function useZones() {
  return useQuery({
    queryKey: queryKeys.zones,
    queryFn: fetchZones,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: 2,
  });
}
