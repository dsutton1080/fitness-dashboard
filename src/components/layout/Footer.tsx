import { Text } from '@/components/text';
import { Badge } from '@/components/badge';

interface FooterProps {
  ouraSync: string;
  stravaSync: string;
  rateLimitUsage?: number;
}

export function Footer({ ouraSync, stravaSync, rateLimitUsage }: FooterProps) {
  return (
    <footer className="flex items-center justify-between px-6 py-4 border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
      <Text className="text-zinc-500 dark:text-zinc-400 text-sm">
        Oura synced {ouraSync} &bull; Strava {stravaSync}
      </Text>
      {rateLimitUsage != null && (
        <Badge color={rateLimitUsage > 80 ? 'red' : rateLimitUsage > 50 ? 'amber' : 'zinc'}>
          Rate limit: {rateLimitUsage}%
        </Badge>
      )}
    </footer>
  );
}
