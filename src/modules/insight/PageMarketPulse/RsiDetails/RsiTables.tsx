import { clsx } from 'clsx';
import { useMemo, useState, type FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Tabs } from 'antd';
import { type useRsiDivergence, type useRsiOverness } from 'api/market-pulse';
import { RsiOvernessTable } from './RsiOvernessTable';
import { RsiDivergenceTable } from './RsiDivergenceTable';

export const RsiTables: FC<{
  className?: string;
  overness: ReturnType<typeof useRsiOverness>;
  divergence: ReturnType<typeof useRsiDivergence>;
}> = ({ className, overness, divergence }) => {
  const { t } = useTranslation('market-pulse');
  const [activeTab, setActiveTab] = useState<
    'over_sold' | 'over_bought' | 'bullish' | 'bearish'
  >('over_sold');

  const tabsItems = useMemo(() => {
    return [
      {
        label: t('indicator_list.rsi.oversold'),
        key: 'over_sold',
        children: <RsiOvernessTable type="over_sold" overness={overness} />,
      },
      {
        label: t('indicator_list.rsi.overbought'),
        key: 'over_bought',
        children: <RsiOvernessTable type="over_bought" overness={overness} />,
      },
      {
        label: t('indicator_list.rsi.bullish'),
        key: 'bullish_divergence',
        children: (
          <RsiDivergenceTable
            type="bullish_divergence"
            divergence={divergence}
          />
        ),
      },
      {
        label: t('indicator_list.rsi.bearish'),
        key: 'bearish_divergence',
        children: (
          <RsiDivergenceTable
            type="bearish_divergence"
            divergence={divergence}
          />
        ),
      },
    ];
  }, [t, overness, divergence]);

  return (
    <div className={clsx('w-full', className)}>
      <Tabs
        onChange={newTab => setActiveTab(newTab as typeof activeTab)}
        items={tabsItems}
      />
    </div>
  );
};
