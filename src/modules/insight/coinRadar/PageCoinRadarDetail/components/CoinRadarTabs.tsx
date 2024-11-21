import { useTranslation } from 'react-i18next';
import Tabs from 'shared/Tabs';
import { useScrollPointTabs } from '../hooks/useScrollPointTabs';

export function CoinRadarTabs({ className }: { className?: string }) {
  const { t } = useTranslation('coin-radar');

  const scrollPointTabs = useScrollPointTabs(
    [
      {
        key: 'coinoverview_trading_view',
        label: t('coin-details.tabs.trading_view.label'),
      },
      {
        key: 'coinoverview_socials',
        label: t('coin-details.tabs.socials.label'),
      },
      {
        key: 'coinoverview_exchanges',
        label: t('coin-details.tabs.markets.label'),
      },
      {
        key: 'coinoverview_hotcoins',
        label: t('coin-details.tabs.hot_coins.label'),
      },
    ],
    160,
  );

  return <Tabs className={className} {...scrollPointTabs} />;
}
