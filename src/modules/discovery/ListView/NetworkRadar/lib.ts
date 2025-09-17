import { type GrpcState, useGrpc } from 'api/grpc-v2';
import type {
  TrenchStreamRequest,
  TrenchStreamResponse,
} from 'api/proto/network_radar';
import { useUserSettings } from 'modules/base/auth/UserSettingsProvider';

export const doesNCoinHaveSafeTopHolders = ({
  topHolders,
  totalSupply,
}: {
  topHolders: number | string | number[] | string[];
  totalSupply: number;
}) => {
  const s2n = (s: string | number) => (Number.isNaN(+s) ? 0 : +s);
  const topHoldersBalance = Array.isArray(topHolders)
    ? topHolders.map(x => s2n(x)).reduce((p, c) => p + c, 0)
    : s2n(topHolders);
  return topHoldersBalance <= (totalSupply / 100) * 20;
};

export const doesNCoinHaveLargeTxns = ({
  totalNumBuys,
  totalNumSells,
}: {
  totalNumBuys: number;
  totalNumSells: number;
}) => totalNumBuys + totalNumSells > 5000;

export const calcNCoinRiskLevel = ({ riskPercent }: { riskPercent: number }) =>
  riskPercent < 15 ? 'low' : riskPercent < 50 ? 'medium' : 'high';

type ThresholdColor = {
  limit: number;
  color: string;
};

export const calcColorByThreshold = ({
  value,
  rules,
  fallback,
}: {
  value?: number;
  rules: ThresholdColor[];
  fallback: string;
}) => {
  for (const rule of rules) {
    if ((value ?? 0) <= rule.limit) {
      return rule.color;
    }
  }
  return fallback;
};

export const calcNCoinMarketCapColor = (mc: number) =>
  calcColorByThreshold({
    value: mc,
    rules: [
      { limit: 30_000, color: '#0edcdc' },
      { limit: 150_000, color: '#f3d525' },
    ],
    fallback: '#00ffa3',
  });

export const calcNCoinBCurveColor = ({
  bCurvePercent,
}: {
  bCurvePercent: number;
}) =>
  calcColorByThreshold({
    value: bCurvePercent,
    rules: [
      { limit: 33, color: '#fff' },
      { limit: 66, color: '#00A3FF' },
      { limit: 99, color: '#00ffa3' },
    ],
    fallback: '#FFDA6C',
  });

export const convertNCoinSecurityFieldToBool = ({
  value,
  type,
}: {
  value: string | boolean | { status?: string };
  type: 'lpBurned' | 'freezable' | 'mintable';
}): boolean => {
  if (typeof value === 'boolean') return value;
  const val = typeof value === 'string' ? value : value.status;

  if (type === 'mintable' || type === 'freezable') {
    return val !== '0';
  }
  if (type === 'lpBurned') {
    return val === '1';
  }
  return false;
};

export type NetworkRadarTab = 'new_pairs' | 'final_stretch' | 'migrated';

export type NetworkRadarStreamFilters = Record<
  NetworkRadarTab,
  Partial<TrenchStreamRequest>
>;

export const useNetworkRadarStream = (): Record<
  NetworkRadarTab,
  GrpcState<TrenchStreamResponse>
> => {
  const { settings } = useUserSettings();

  const newPairs = useGrpc({
    service: 'network_radar',
    method: 'trenchNewBornStream',
    payload: settings.trench_filters.new_pairs,
    enabled: true,
    history: 0,
  });
  const finalStretch = useGrpc({
    service: 'network_radar',
    method: 'trenchFinalStretchStream',
    payload: settings.trench_filters.final_stretch,
    enabled: true,
    history: 0,
  });
  const migrated = useGrpc({
    service: 'network_radar',
    method: 'trenchMigratedStream',
    payload: settings.trench_filters.migrated,
    enabled: true,
    history: 0,
  });

  const makeResultUnique = (
    res: GrpcState<TrenchStreamResponse>,
  ): GrpcState<TrenchStreamResponse> => {
    const seen = new Set<string>();
    const cleanedResults = res.data?.results
      .map(row => {
        const key = row.symbol?.slug;
        if (!key || seen.has(key)) return null;
        seen.add(key);
        return row;
      })
      .filter(x => x !== null);

    return {
      ...res,
      data: Array.isArray(cleanedResults)
        ? {
            ...res.data,
            results: cleanedResults,
          }
        : undefined,
    };
  };

  return {
    new_pairs: makeResultUnique(newPairs),
    final_stretch: makeResultUnique(finalStretch),
    migrated: makeResultUnique(migrated),
  };
};
