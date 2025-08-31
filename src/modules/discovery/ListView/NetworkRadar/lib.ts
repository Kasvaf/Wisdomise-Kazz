import { type GrpcState, useGrpc } from 'api/grpc-v2';
import type {
  TrenchStreamRequest,
  TrenchStreamResponse,
} from 'api/proto/network_radar';

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

export const calcNCoinMarketCapColor = (mc: number) =>
  mc <= 30_000
    ? '#0edcdc' /* cyan */
    : mc <= 150_000
      ? '#f3d525' /* yellow */
      : '#00ffa3'; /* green */

export const calcNCoinBCurveColor = ({
  bCurvePercent,
}: {
  bCurvePercent: number;
}) =>
  bCurvePercent <= 33
    ? '#FFF'
    : bCurvePercent <= 66
      ? '#00A3FF'
      : bCurvePercent <= 99
        ? '#00FFA3'
        : '#FFDA6C';

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

export const useNetworkRadarStream = (
  filters: NetworkRadarStreamFilters,
): Record<NetworkRadarTab, GrpcState<TrenchStreamResponse>> => {
  const newPairs = useGrpc({
    service: 'network_radar',
    method: 'trenchNewBornStream',
    payload: filters.new_pairs,
    enabled: true,
    history: 0,
  });
  const finalStretch = useGrpc({
    service: 'network_radar',
    method: 'trenchFinalStretchStream',
    payload: filters.final_stretch,
    enabled: true,
    history: 0,
  });
  const migrated = useGrpc({
    service: 'network_radar',
    method: 'trenchMigratedStream',
    payload: filters.migrated,
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
