import { clsx } from 'clsx';
import { type FC } from 'react';
import useMenuItems from 'modules/base/Layout/MenuItems/useMenuItems';

export const DISCOVER_TABS = [
  'social-radar',
  'technical-radar',
  'whale-radar',
  'network-radar',
] as const;

export type CoinDiscoverTab = (typeof DISCOVER_TABS)[number];

export const CoinDiscoverTabs: FC<{
  value: CoinDiscoverTab;
  onChange?: (newValue: CoinDiscoverTab) => void;
  className?: string;
}> = ({ value, onChange, className }) => {
  const { items } = useMenuItems();

  const tabs = items.filter(x =>
    DISCOVER_TABS.includes(x.name as CoinDiscoverTab),
  );

  return (
    <div className={clsx('flex items-center justify-between gap-2', className)}>
      {tabs.map(tab => (
        <button
          key={tab.name}
          className={clsx(
            'flex flex-col items-center gap-1 text-xs [&_svg]:size-5',
            tab.name === value && 'text-v1-content-brand',
          )}
          onClick={() => onChange?.(tab.name as CoinDiscoverTab)}
        >
          {tab.icon}
          {tab.text}
        </button>
      ))}
    </div>
  );
};
