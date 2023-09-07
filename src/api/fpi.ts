import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import {
  type InvestorAssetStructures,
  type FinancialProductInstance,
  type FpiPosition,
} from './types/investorAssetStructure';

export const useFpiQuery = (fpiKey?: string) =>
  useQuery<FinancialProductInstance>(
    ['fpid', fpiKey],
    async () => {
      if (!fpiKey) throw new Error('unexpected');
      const { data } = await axios.get<InvestorAssetStructures>(
        '/ias/investor-asset-structures',
      );
      for (const fpi of data[0]?.financial_product_instances ?? []) {
        if (fpi.key === fpiKey) {
          for (const ab of fpi.asset_bindings) {
            ab.name =
              ab.asset.type === 'SYMBOL'
                ? ab.asset.symbol.name
                : ab.asset.pair.base.name;
          }
          return fpi;
        }
      }
      throw new Error('not found');
    },
    {
      enabled: Boolean(fpiKey),
    },
  );

const useFpiPositionHistoryFullQuery = (fpiKey?: string) =>
  useQuery<FpiPosition[]>(
    ['fpiHistoryFull', fpiKey],
    async () => {
      if (!fpiKey) throw new Error('unexpected');
      const { data } = await axios.get<FpiPosition[]>(
        `/ias/financial-product-instances/${fpiKey}/positions`,
      );
      return data;
    },
    { enabled: fpiKey != null },
  );

export const useFpiPositionHistory = ({
  fpiKey,
  start_datatime: start,
  end_datetime: end,
  offset,
  limit,
}: {
  fpiKey?: string;
  start_datatime?: string;
  end_datetime?: string;
  offset?: number;
  limit?: number;
}) => {
  const fullHistory = useFpiPositionHistoryFullQuery(fpiKey);
  return useQuery<{ position_history: FpiPosition[]; total: number }>(
    ['fpiHistory', fullHistory, fpiKey, start, end, offset, limit],
    async () => {
      const h = fullHistory.data;
      if (!fpiKey || !h) throw new Error('unexpected');

      if (offset != null && limit != null) {
        return {
          total: h.length,
          position_history: h.slice(offset, offset + limit),
        };
      }

      if (start != null && end != null) {
        return {
          total: h.length,
          position_history: h.filter(
            x =>
              (!x.exit_time || +new Date(x.exit_time) > +new Date(start)) &&
              +new Date(x.entry_time) < +new Date(end),
          ),
        };
      }

      throw new Error('unexpected');
    },
    {
      keepPreviousData: true,
      enabled:
        fpiKey != null &&
        fullHistory.data != null &&
        ((start != null && end != null) || (offset != null && limit != null)),
    },
  );
};
