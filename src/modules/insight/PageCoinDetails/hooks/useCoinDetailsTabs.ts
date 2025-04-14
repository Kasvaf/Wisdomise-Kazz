import {
  type ComponentProps,
  type RefObject,
  useCallback,
  useRef,
  useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import { useMutationObserver } from 'utils/useMutationObserver';
import { type CoinDetailsTabs } from '../components/CoinDetailsTabs';

export const useCoinDetailsTabs = (root: RefObject<HTMLElement>) => {
  const { t } = useTranslation('coin-radar');

  const initialTabs = useRef<ComponentProps<typeof CoinDetailsTabs>['options']>(
    [
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
        hidden: true,
      },
      {
        value: 'coinoverview_pools',
        label: t('coin-details.tabs.pools.label'),
      },
      {
        value: 'coinoverview_exchanges',
        label: t('coin-details.tabs.markets.label'),
      },
    ],
  );

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

  useMutationObserver(root, refreshTabs, {
    childList: true,
    subtree: true,
  });

  return tabs;
};
