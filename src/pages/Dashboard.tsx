import { useCallback, useMemo, useState } from 'react';
import AppShell from '@/components/layout/AppShell';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { StatCard } from '@/components/cards/StatCard';
import { TrendsCard } from '@/components/cards/TrendsCard';
import { ContributorsCard } from '@/components/cards/ContributorsCard';
import { StravaTotalsCard, WeeklyMileageCard } from '@/components/cards/WeeklyMileageCard';
import { ActivitiesTableCard } from '@/components/cards/ActivitiesTableCard';
import { LoadVsRecoveryCard } from '@/components/cards/LoadVsRecoveryCard';
import { ActivityDrawer } from '@/components/activity/ActivityDrawer';
import { useReadiness, useDailySleep, useDailyActivity } from '@/hooks/useOura';
import { useAthlete, useStats, useRecentActivities } from '@/hooks/useStrava';
import { useActivityDetail, useStreams } from '@/hooks/useStrava';
import { useCombinedLoad } from '@/hooks/useCombinedLoad';
import { rangeForDays } from '@/lib/dates';
import { formatDelta } from '@/lib/format';

export function Dashboard() {
  const [inMiles, setInMiles] = useState(true);
  const [selectedActivityId, setSelectedActivityId] = useState<number | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const range = useMemo(() => rangeForDays(30), []);

  const readinessQuery = useReadiness(range);
  const sleepQuery = useDailySleep(range);
  const sleepDetailQuery = useCombinedLoad().sleepDetail;
  const activityQuery = useDailyActivity(range);
  const athleteQuery = useAthlete();
  const statsQuery = useStats(athleteQuery.data?.id);
  const activitiesQuery = useRecentActivities(30);

  const selectedActivityQuery = useActivityDetail(selectedActivityId ?? -1);
  const streamsQuery = useStreams(selectedActivityId ?? -1);

  const combinedLoad = useCombinedLoad();

  const handleRefresh = useCallback(() => {
    setRefreshKey((k) => k + 1);
  }, []);

  const lastSyncOura = useMemo(() => {
    if (!readinessQuery.data?.[0]?.meta?.updated_at) return 'never';
    const d = new Date(readinessQuery.data[0].meta.updated_at);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) + ' ' + d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  }, [readinessQuery.data]);

  const lastSyncStrava = useMemo(() => {
    if (!activitiesQuery.data?.[0]?.start_date_local) return 'never';
    const d = new Date(activitiesQuery.data[0].start_date_local);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) + ' ' + d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  }, [activitiesQuery.data]);

  const runners = athleteQuery.data ?? undefined;

  // Stat cards data
  const todayReadiness = readinessQuery.data?.[0];
  const todaySteps = activityQuery.data?.[0];
  const todaySleep = sleepQuery.data?.[0];

  const sevenDaysAgo = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() - 7);
    return d.toISOString().split('T')[0];
  }, []);

  const prevReadiness = readinessQuery.data?.find((r) => r.day === sevenDaysAgo);
  const prevSteps = activityQuery.data?.find((a) => a.day === sevenDaysAgo);
  const prevSleep = sleepQuery.data?.find((s) => s.day === sevenDaysAgo);

  // Sparkline data for StatCards
  const readinessSparkline = useMemo(() => {
    return (readinessQuery.data ?? []).slice(0, 7).map((r) => ({ date: r.day, value: r.score }));
  }, [readinessQuery.data]);

  const stepsSparkline = useMemo(() => {
    return (activityQuery.data ?? []).slice(0, 7).map((a) => ({ date: a.day, value: a.steps }));
  }, [activityQuery.data]);

  const sleepSparkline = useMemo(() => {
    return (sleepQuery.data ?? []).slice(0, 7).map((s) => ({ date: s.day, value: s.score }));
  }, [sleepQuery.data]);

  const onActivityClick = useCallback((id: number) => {
    setSelectedActivityId(id);
  }, []);

  const closeDrawer = useCallback(() => {
    setSelectedActivityId(null);
  }, []);

  // Run-only activities for weekly mileage
  const runActivities = useMemo(() => {
    return (activitiesQuery.data ?? []).filter((a) => a.sport_type === 'Run');
  }, [activitiesQuery.data]);

  const runDistanceYtd = statsQuery.data?.ytd_run_totals?.distance ?? 0;
  const runCountYtd = statsQuery.data?.ytd_run_totals?.count ?? 0;
  const runDistanceAll = statsQuery.data?.all_run_totals?.distance ?? 0;
  const runCountAll = statsQuery.data?.all_run_totals?.count ?? 0;

  return (
    <AppShell>
      <div key={refreshKey}>
        <Header
          athlete={runners}
          lastSyncOura={lastSyncOura}
          lastSyncStrava={lastSyncStrava}
          onRefresh={handleRefresh}
        />

        <main className="flex-1 space-y-6 px-6 py-8">
          {/* Unit toggle */}
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-zinc-950 dark:text-white">Dashboard</h1>
            <div className="flex items-center gap-1 rounded-md bg-zinc-100 dark:bg-zinc-800 p-0.5">
              <button
                onClick={() => setInMiles(true)}
                className={`px-3 py-1 rounded text-sm font-medium transition-colors ${inMiles ? 'bg-white text-zinc-950 shadow-xs dark:bg-zinc-900 dark:text-white' : 'text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'}`}
              >
                Miles
              </button>
              <button
                onClick={() => setInMiles(false)}
                className={`px-3 py-1 rounded text-sm font-medium transition-colors ${!inMiles ? 'bg-white text-zinc-950 shadow-xs dark:bg-zinc-900 dark:text-white' : 'text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'}`}
              >
                Kilometers
              </button>
            </div>
          </div>

          {/* Stat Cards Row */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <StatCard
              label="Readiness Score"
              value={todayReadiness?.score ?? '--'}
              delta={formatDelta(todayReadiness?.score ?? null, prevReadiness?.score ?? null)}
              sparkline={readinessSparkline}
              unit="/100"
            />
            <StatCard
              label="Steps Today"
              value={todaySteps?.steps != null ? todaySteps.steps.toLocaleString() : '--'}
              delta={formatDelta(todaySteps?.steps ?? null, prevSteps?.steps ?? null)}
              sparkline={stepsSparkline}
            />
            <StatCard
              label="Sleep Score"
              value={todaySleep?.score ?? '--'}
              delta={formatDelta(todaySleep?.score ?? null, prevSleep?.score ?? null)}
              sparkline={sleepSparkline}
              unit="/100"
            />
          </div>

          {/* Trends + Load/Recovery */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <TrendsCard
              readinessData={readinessQuery.data ?? []}
              sleepData={sleepDetailQuery.data ?? []}
            />
            <LoadVsRecoveryCard data={combinedLoad.combined} />
          </div>

          {/* Contributors + Strava Totals */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <ContributorsCard readinessData={readinessQuery.data ?? []} />
            <StravaTotalsCard
              runDistanceYtd={runDistanceYtd}
              runCountYtd={runCountYtd}
              runDistanceAll={runDistanceAll}
              runCountAll={runCountAll}
              inMiles={inMiles}
            />
          </div>

          {/* Weekly Mileage */}
          <WeeklyMileageCard activities={runActivities} inMiles={inMiles} />

          {/* Recent Activities Table */}
          <ActivitiesTableCard
            activities={activitiesQuery.data ?? []}
            inMiles={inMiles}
            onActivityClick={onActivityClick}
          />
        </main>

        <Footer
          ouraSync={lastSyncOura}
          stravaSync={lastSyncStrava}
        />

        {/* Activity Detail Drawer */}
        {selectedActivityId != null && (
          <ActivityDrawer
            activity={selectedActivityQuery.data}
            streams={streamsQuery.data}
            inMiles={inMiles}
            onClose={closeDrawer}
          />
        )}
      </div>
    </AppShell>
  );
}
