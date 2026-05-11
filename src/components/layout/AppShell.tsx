import { StackedLayout } from '@/components/stacked-layout';
import type { ReactNode } from 'react';

interface AppShellProps {
  children: ReactNode;
}

export default function AppShell({ children }: AppShellProps) {
  return (
    <StackedLayout navbar={null} sidebar={null}>
      {children}
    </StackedLayout>
  );
}
