import { type ComponentProps, useCallback, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { type CoinRadarTabs } from '../components/CoinRadarTabs';

export const useCoinDetailsTabs = () => {
  const { t } = useTranslation('coin-radar');

  const initialTabs = useRef<ComponentProps<typeof CoinRadarTabs>['options']>([
    {
      value: 'coinoverview_trading_view',
      label: t('coin-details.tabs.trading_view.label'),
    },
    {
      value: 'coinoverview_socials',
      label: t('coin-details.tabs.socials.label'),
    },
    {
      value: 'coinoverview_whales',
      label: t('coin-details.tabs.whale_list.label'),
    },
    {
      value: 'coinoverview_exchanges',
      label: t('coin-details.tabs.markets.label'),
    },
  ]);

  const [tabs, setTabs] = useState(initialTabs.current);

  const refreshTabs = useCallback(() => {
    const newTabs = initialTabs.current.map(r => ({
      ...r,
      disabled: !document.querySelector(`#${r.value}`),
    }));
    if (newTabs.some((x, i) => (tabs[i].disabled ?? false) !== x.disabled)) {
      setTabs(
        initialTabs.current.map(r => ({
          ...r,
          disabled: !document.querySelector(`#${r.value}`),
        })),
      );
    }
  }, [tabs]);

  return [tabs, refreshTabs] as const;
};
