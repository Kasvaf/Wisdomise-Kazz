import {
  type ComponentProps,
  type RefObject,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import { type CoinRadarTabs } from '../components/CoinRadarTabs';

export const useCoinDetailsTabs = (root: RefObject<HTMLElement>) => {
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

  useEffect(() => {
    if (!root.current) return;

    const observer = new MutationObserver(refreshTabs);
    observer.observe(root.current, { childList: true, subtree: true });
    refreshTabs();

    return () => observer.disconnect();
  }, [refreshTabs, root]);

  return tabs;
};
