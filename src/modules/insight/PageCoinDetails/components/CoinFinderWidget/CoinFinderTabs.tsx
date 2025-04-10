import { clsx } from 'clsx';
import { type FC } from 'react';
import useMenuItems from 'modules/base/Layout/MenuItems/useMenuItems';

const TABS = [
  'social-radar',
  'technical-radar',
  'whale-radar',
  'network-radar',
] as const;

export type CoinFinderTab = (typeof TABS)[number];

export const CoinFinderTabs: FC<{
  value: CoinFinderTab;
  onChange?: (newValue: CoinFinderTab) => void;
  className?: string;
}> = ({ value, onChange, className }) => {
  const { items } = useMenuItems();

  const tabs = items.filter(x => TABS.includes(x.name as CoinFinderTab));

  return (
    <div className={clsx('flex items-center justify-between gap-2', className)}>
      {tabs.map(tab => (
        <button
          key={tab.name}
          className={clsx(
            'flex flex-col items-center gap-1 text-xs [&_svg]:size-5',
            tab.name === value && 'text-v1-content-brand',
          )}
          onClick={() => onChange?.(tab.name as CoinFinderTab)}
        >
          {tab.icon}
          {tab.text}
        </button>
      ))}
    </div>
  );
};
