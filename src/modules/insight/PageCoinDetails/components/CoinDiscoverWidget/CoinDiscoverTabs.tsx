import { type FC } from 'react';
import { clsx } from 'clsx';
import useMenuItems from 'modules/base/Layout/MenuItems/useMenuItems';
import { ButtonSelect } from 'shared/v1-components/ButtonSelect';
import { useHasFlag } from 'api';

export const DISCOVER_TABS = [
  'network-radar',
  'coin-radar',
  'whale-radar',
  'social-radar',
  'technical-radar',
] as const;

export type CoinDiscoverTab = (typeof DISCOVER_TABS)[number];

export const CoinDiscoverTabs: FC<{
  value: CoinDiscoverTab;
  onChange?: (newValue: CoinDiscoverTab) => void;
  className?: string;
}> = ({ value, onChange, className }) => {
  const hasFlag = useHasFlag();
  const menuItems = useMenuItems();
  const items = menuItems.items.filter(i => !i.hide && hasFlag(i.link));
  const tabs = DISCOVER_TABS.map(x => items.find(y => y.name === x)).filter(
    x => !!x,
  );

  return (
    <ButtonSelect
      className={clsx('!h-12', className)}
      value={value}
      onChange={onChange}
      size="xs"
      variant="default"
      surface={1}
      options={tabs.map(tab => ({
        value: tab.name as CoinDiscoverTab,
        label: (
          <div className="flex flex-col items-center gap-1 text-xs [&_svg]:size-5">
            {tab.icon}
            {tab.text}
          </div>
        ),
      }))}
    />
  );
};
