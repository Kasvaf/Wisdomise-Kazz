import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import makeArray from 'utils/makeArray';
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

const h = makeFakePositions();
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
}) =>
  useQuery<{ position_history: FpiPosition[] }>(
    ['fpiHistory', fpiKey, start, end, offset, limit],
    () => {
      // const h = makeFakePositions();
      if (offset != null && limit != null) {
        return {
          position_history: h.slice(offset, offset + limit),
        };
      }

      if (start != null && end != null) {
        return {
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
      enabled:
        fpiKey != null &&
        ((start != null && end != null) || (offset != null && limit != null)),
    },
  );

function makeFakePositions() {
  const end = new Date();
  const start = new Date();
  start.setMonth(start.getMonth() - 1);

  const durR = makeArray(300).map(() => Math.random());
  const sum = durR.reduce((a, b) => a + b, 0);
  const dur = durR.map(x => (x / sum) * (+end - +start));

  const pairs = [
    {
      title: 'Bitcoin',
      base: { name: 'BTC' },
      quote: { name: 'USDT' },
    },
    {
      title: 'Ethereum',
      base: { name: 'ETH' },
      quote: { name: 'USDT' },
    },
    {
      title: 'BNB',
      base: { name: 'BNB' },
      quote: { name: 'USDT' },
    },
  ];

  const result: FpiPosition[] = [];
  let now = start;
  for (let i = 0; i < 300; i += 2) {
    const exit = new Date(+now + dur[i]);
    result.push({
      entry_time: now.toISOString(),
      exit_time: exit.toISOString(),
      // exit_time: Math.random() < 0.5 ? exit.toISOString() : '',
      entry_price: Math.random() * 100,
      exit_price: Math.random() * 100,
      pair: pairs[Math.trunc(Math.random() * 3)],
      pnl: Math.random() * 100 - 50,
      position_side: Math.random() < 0.5 ? 'long' : 'short',
    });
    now = new Date(+exit + dur[i + 1]);
  }
  return result;
}
