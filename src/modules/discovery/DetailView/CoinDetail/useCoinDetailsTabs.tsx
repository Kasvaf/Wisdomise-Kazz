import { useUnifiedCoinDetails } from 'modules/discovery/DetailView/CoinDetail/lib';
import { useMarketCap } from 'modules/discovery/DetailView/CoinDetail/useMarketCap';
import { type ComponentProps, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useOrdersQuery } from 'services/rest/order';
import { Badge } from 'shared/v1-components/Badge';
import type { ButtonSelect } from 'shared/v1-components/ButtonSelect';

export const useCoinDetailsTabs = () => {
  const { t } = useTranslation('coin-radar');
  const { data: pendingOrders } = useOrdersQuery({ status: 'PENDING' });
  const { data: marketCapUsd } = useMarketCap({});
  const { symbol } = useUnifiedCoinDetails();
  const [showInsight, setShowInsight] = useState(false);

  useEffect(() => {
    if (marketCapUsd > 10 ** 6) {
      setShowInsight(true);
    }
  }, [marketCapUsd]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <reason>
  useEffect(() => {
    setShowInsight(false);
  }, [symbol.contractAddress]);

  const initialTabs = useMemo<
    ComponentProps<typeof ButtonSelect<string>>['options']
  >(
    () => [
      {
        value: 'coinoverview_swaps',
        label: 'Transactions',
      },
      {
        value: 'coinoverview_orders',
        label: (
          <div className="flex items-center gap-1">
            Orders
            {(pendingOrders?.count ?? 0) > 0 && (
              <Badge color="brand" variant="solid">
                {pendingOrders?.count}
              </Badge>
            )}
          </div>
        ),
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
        value: 'coinoverview_dev',
        label: 'Dev Tokens',
      },
      ...(showInsight
        ? [
            {
              value: 'coinoverview_trading_view',
              label: t('coin-details.tabs.trading_view.label'),
            },
            {
              value: 'coinoverview_socials',
              label: t('coin-details.tabs.socials.label'),
            },
          ]
        : []),
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
    ],
    [pendingOrders?.count, t, showInsight],
  );
  return initialTabs;
};
