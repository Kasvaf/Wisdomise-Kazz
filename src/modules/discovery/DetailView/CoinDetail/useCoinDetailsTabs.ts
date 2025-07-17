import {
  type ComponentProps,
  type RefObject,
  useCallback,
  useRef,
  useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import { useMutationObserver } from 'utils/useMutationObserver';
import { type CoinDetailsTabs } from './CoinDetailsTabs';

export const useCoinDetailsTabs = (root: RefObject<HTMLElement>) => {
  const { t } = useTranslation('coin-radar');

  const initialTabs = useRef<ComponentProps<typeof CoinDetailsTabs>['options']>(
    [
      {
        value: 'coinoverview_introduction',
        label: 'Intro',
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
        value: 'coinoverview_exchanges',
        label: t('coin-details.tabs.markets.label'),
      },
      {
        value: 'coinoverview_active_whales',
        label: 'Active Whales',
      },
      {
        value: 'coinoverview_holding_whales',
        label: 'Holding Whales',
      },
    ],
  );

  const [tabs, setTabs] = useState(initialTabs.current);

  const refreshTabs = useCallback(() => {
    setTabs(prevTabs => {
      let updated = false;
      const newTabs = tabs.map(tab => {
        const newTab = {
          ...tab,
          hidden: !document.querySelector(`#${tab.value}`),
        };
        if (newTab.hidden !== tab.hidden) {
          updated = true;
        }
        return newTab;
      });
      if (updated) return newTabs;
      return prevTabs;
    });
  }, [tabs]);

  useMutationObserver(root, refreshTabs, {
    childList: true,
    subtree: true,
  });

  return tabs;
};
