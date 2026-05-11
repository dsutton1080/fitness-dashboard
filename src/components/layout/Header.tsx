import { useState, useEffect } from 'react';
import { Button } from '@/components/button';
import type { DetailedAthlete } from '@/types/strava';

interface HeaderProps {
  athlete: DetailedAthlete | undefined;
  lastSyncOura: string;
  lastSyncStrava: string;
  onRefresh: () => void;
}

export function Header({ athlete, lastSyncOura, lastSyncStrava, onRefresh }: HeaderProps) {
  const [dark, setDark] = useState(() =>
    window.matchMedia('(prefers-color-scheme: dark)').matches
  );

  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e: MediaQueryListEvent) => setDark(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
  }, [dark]);

  const name = athlete ? `${athlete.firstname}'s Dashboard` : "Dashboard";

  return (
    <header className="flex items-center justify-between px-6 py-4 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
       <div className="flex items-center gap-3">
          <div>
            <h2>{name}</h2>
            <p className="text-zinc-500 dark:text-zinc-400 mt-0.5 text-sm">
              Oura synced {lastSyncOura} &bull; Strava {lastSyncStrava}
            </p>
          </div>
        </div>
      <div className="flex items-center gap-2">
        <Button plain onClick={onRefresh}>
          Refresh
        </Button>
      </div>
    </header>
  );
}
