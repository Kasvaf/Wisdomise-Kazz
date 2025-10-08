import { type ComponentProps, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import type { ButtonSelect } from 'shared/v1-components/ButtonSelect';

export const useCoinDetailsTabs = () => {
  const { t } = useTranslation('coin-radar');

  const initialTabs = useRef<
    ComponentProps<typeof ButtonSelect<string>>['options']
  >([
    {
      value: 'coinoverview_swaps',
      label: 'Transactions',
    },
    {
      value: 'coinoverview_top_traders',
      label: 'Top Traders',
    },
    {
      value: 'coinoverview_top_holders',
      label: 'Top Holders',
    },
    {
      value: 'coinoverview_pools',
      label: t('coin-details.tabs.pools.label'),
    },
    {
      value: 'coinoverview_trading_view',
      label: t('coin-details.tabs.trading_view.label'),
    },
    {
      value: 'coinoverview_socials',
      label: t('coin-details.tabs.socials.label'),
    },
    {
      value: 'coinoverview_bubble_chart',
      label: 'Bubble Chart',
    },
    // {
    //   value: 'coinoverview_exchanges',
    //   label: t('coin-details.tabs.markets.label'),
    // },
    // {
    //   value: 'coinoverview_active_whales',
    //   label: 'Active Whales',
    // },
    // {
    //   value: 'coinoverview_holding_whales',
    //   label: 'Holding Whales',
    // },
  ]);
  return initialTabs.current;
};
