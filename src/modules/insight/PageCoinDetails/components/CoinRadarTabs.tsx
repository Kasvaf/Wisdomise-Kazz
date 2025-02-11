import { type ReactNode } from 'react';
import { clsx } from 'clsx';
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

  return (
    <Tabs className={clsx('mobile:pe-10', className)} {...scrollPointTabs} />
  );
}
