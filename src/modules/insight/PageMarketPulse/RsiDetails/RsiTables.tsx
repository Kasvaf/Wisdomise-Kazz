import { clsx } from 'clsx';
import { type ReactNode, useMemo, useState, type FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Tabs, Tooltip } from 'antd';
import { bxInfoCircle } from 'boxicons-quasar';
import { type useRsiDivergence, type useRsiOverness } from 'api/market-pulse';
import Icon from 'shared/Icon';
import { RsiOvernessTable } from './RsiOvernessTable';
import { RsiDivergenceTable } from './RsiDivergenceTable';

const RsiTabLabel: FC<{
  label: string;
  info?: ReactNode;
}> = ({ label, info }) => (
  <span className="inline-flex items-center gap-2">
    {label}
    {info && (
      <Tooltip title={info}>
        <Icon name={bxInfoCircle} size={16} className="text-white/60" />
      </Tooltip>
    )}
  </span>
);

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
        label: (
          <RsiTabLabel
            label={t('indicator_list.rsi.oversold')}
            info={t('indicator_list.rsi.oversold-info')}
          />
        ),
        key: 'over_sold',
        children: <RsiOvernessTable type="over_sold" overness={overness} />,
      },
      {
        label: (
          <RsiTabLabel
            label={t('indicator_list.rsi.overbought')}
            info={t('indicator_list.rsi.overbought-info')}
          />
        ),
        key: 'over_bought',
        children: <RsiOvernessTable type="over_bought" overness={overness} />,
      },
      {
        label: (
          <RsiTabLabel
            label={t('indicator_list.rsi.bullish')}
            info={t('indicator_list.rsi.bullish-info')}
          />
        ),
        key: 'bullish_divergence',
        children: (
          <RsiDivergenceTable
            type="bullish_divergence"
            divergence={divergence}
          />
        ),
      },
      {
        label: (
          <RsiTabLabel
            label={t('indicator_list.rsi.bearish')}
            info={t('indicator_list.rsi.bearish-info')}
          />
        ),
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
