import { type ReactNode } from 'react';
import Tabs from 'shared/Tabs';
import { useScrollPointTabs } from '../hooks/useScrollPointTabs';

export function CoinRadarTabs({
  className,
  value,
}: {
  className?: string;
  value: Array<{ key: string; label: ReactNode }>;
}) {
  const scrollPointTabs = useScrollPointTabs(value, 350);

  return <Tabs className={className} {...scrollPointTabs} />;
}
