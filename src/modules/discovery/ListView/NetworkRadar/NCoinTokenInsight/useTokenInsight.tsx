import type { RiskData } from 'api/proto/network_radar';
import { clsx } from 'clsx';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { ReadableNumber } from 'shared/ReadableNumber';
import { ReactComponent as BundleHolding } from './bundle_holding.svg';
import { ReactComponent as DevHolding } from './dev_holding.svg';
import { ReactComponent as DexPaid } from './dex_paid.svg';
import { ReactComponent as Holders } from './holders.svg';
import { ReactComponent as InsidersHolding } from './insiders_holding.svg';
import { ReactComponent as LpBurned } from './lp_burned.svg';
import { ReactComponent as SnipersHolding } from './snipers_holding.svg';
import { ReactComponent as Top10HoldersHolding } from './top_10_holders_holding.svg';

export const useRisks = (value?: RiskData) => {
  return useMemo(
    () => ({
      value: (
        <span>
          <span
            className={clsx(
              value?.risks.some(x => x.level === 'danger')
                ? 'text-v1-content-negative'
                : value?.risks.length
                  ? 'text-v1-content-notice'
                  : 'text-v1-content-positive',
            )}
          >
            {value?.riskPercent ?? 0}
          </span>
          <span className="text-v1-content-secondary">/100</span>
        </span>
      ),
      title: 'Risk',
      fullTitle: 'Risk',
      color: '',
    }),
    [value],
  );
};

export const useDexPaid = (value?: boolean) => {
  return useMemo(
    () => ({
      icon: DexPaid,
      value: value ? 'Paid' : 'Unpaid',
      title: 'Dex Paid',
      fullTitle: 'Dex Paid',
      color: value ? 'green' : 'red',
    }),
    [value],
  );
};

export const useHoldersNumber = (value?: number) => {
  return useMemo(
    () => ({
      icon: Holders,
      value: (
        <ReadableNumber
          format={{ compactInteger: true, decimalLength: 1 }}
          value={value}
        />
      ),
      title: 'Holders',
      fullTitle: 'Holders',
      color: 'gray',
    }),
    [value],
  );
};

export const useLpBurned = (value?: boolean) => {
  return useMemo(
    () => ({
      icon: LpBurned,
      value: value ? 'Yes' : 'No',
      title: 'Lp Burned',
      fullTitle: 'Lp Burned',
      color: typeof value === 'boolean' ? (value ? 'green' : 'red') : 'gray',
    }),
    [value],
  );
};

export const useInsiderHolding = (value?: number) => {
  const { t } = useTranslation('network-radar');

  return useMemo(
    () => ({
      icon: InsidersHolding,
      value: (
        <span>
          <ReadableNumber value={value} />%
        </span>
      ),
      title: t('network-radar:token_insight.insiders_holding.mini'),
      fullTitle: t('network-radar:token_insight.insiders_holding.full'),
      color:
        typeof value === 'number' ? (value < 15 ? 'green' : 'red') : 'gray',
    }),
    [t, value],
  );
};

export const useSniperHolding = (value?: number) => {
  const { t } = useTranslation('network-radar');

  return useMemo(
    () => ({
      icon: SnipersHolding,
      value: (
        <span>
          <ReadableNumber value={value} />%
        </span>
      ),
      title: t('network-radar:token_insight.snipers_holding.mini'),
      fullTitle: t('network-radar:token_insight.snipers_holding.full'),
      color:
        typeof value === 'number' ? (value < 15 ? 'green' : 'red') : 'gray',
    }),
    [t, value],
  );
};

export const useDevHolding = (value?: number) => {
  const { t } = useTranslation('network-radar');

  return useMemo(
    () => ({
      icon: DevHolding,
      value: (
        <span>
          <ReadableNumber value={value} />%
        </span>
      ),
      title: t('network-radar:token_insight.dev_holding.mini'),
      fullTitle: t('network-radar:token_insight.dev_holding.full'),
      color:
        typeof value === 'number' ? (value < 15 ? 'green' : 'red') : 'gray',
    }),
    [t, value],
  );
};

export const useTop10Holding = (value?: number) => {
  const { t } = useTranslation('network-radar');

  return useMemo(
    () => ({
      icon: Top10HoldersHolding,
      value: (
        <span>
          <ReadableNumber value={value} />%
        </span>
      ),
      title: t('network-radar:token_insight.top_10_holders_holding.mini'),
      fullTitle: t('network-radar:token_insight.top_10_holders_holding.full'),
      color:
        typeof value === 'number' ? (value < 15 ? 'green' : 'red') : 'gray',
    }),
    [t, value],
  );
};

export const useBundleHolding = (value?: number) => {
  const { t } = useTranslation('network-radar');

  return useMemo(
    () => ({
      icon: BundleHolding,
      value: (
        <span>
          <ReadableNumber value={value} />%
        </span>
      ),
      title: t('network-radar:token_insight.bundle_holding.mini'),
      fullTitle: t('network-radar:token_insight.bundle_holding.full'),
      color:
        typeof value === 'number' ? (value < 15 ? 'green' : 'red') : 'gray',
    }),
    [t, value],
  );
};
