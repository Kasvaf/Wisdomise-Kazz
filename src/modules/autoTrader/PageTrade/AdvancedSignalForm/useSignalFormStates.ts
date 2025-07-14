import { v4 } from 'uuid';
import { useMemo, useState } from 'react';
import {
  type OpenOrderInput,
  type OpenOrderResponse,
  type SignalItem,
} from 'api/builder';
import { type TraderInputs } from '../types';

export interface TpSlData {
  key: string;
  amountRatio: string;
  priceExact: string;
  applied: boolean;
  appliedAt?: Date;
  removed: boolean;
}

export interface OpenOrderData extends TpSlData {
  isMarket: boolean;
}

function toApiContract(items: TpSlData[]) {
  const result: SignalItem[] = [];
  if (!items?.length) return { items: result };

  let prevSum = 0;
  for (const x of items) {
    if (x.removed) continue;
    result.push({
      key: x.applied ? x.key : v4(),
      amount_ratio: +x.amountRatio / (100 - prevSum),
      price_exact: +x.priceExact,
    });
    prevSum += Number(x.amountRatio);
  }
  const lastItem = result[result.length - 1];
  if (lastItem && lastItem.amount_ratio > 0.99) {
    lastItem.amount_ratio = 1;
  }
  return { items: result };
}

export function sortTpSlItems({
  items,
  type,
}: {
  items: TpSlData[];
  type: 'TP' | 'SL';
}) {
  return [...items].sort(
    (a, b) => (+a.priceExact - +b.priceExact) * (type === 'TP' ? 1 : -1),
  );
}

function getSafetyOpens(
  orders: OpenOrderData[],
  remoteOrders: OpenOrderResponse[],
  marketPrice: number,
): OpenOrderInput[] {
  const remotesByKey = Object.fromEntries(remoteOrders.map(x => [x.key, x]));
  const result = orders
    .filter(x => !x.removed)
    .map(
      x =>
        ({
          key: x.applied ? x.key : v4(),
          amount: +x.amountRatio / 100,
          condition: x.applied
            ? remotesByKey[x.key].condition
            : x.isMarket
            ? { type: 'true' as const }
            : {
                type: 'compare' as const,
                op:
                  +x.priceExact < marketPrice
                    ? ('<=' as const)
                    : ('>=' as const),
                left: 'price' as const,
                right: +x.priceExact,
              },
        }) as const,
    );

  if (!orders[0].isMarket) {
    result.unshift({
      key: remoteOrders?.[0]?.key || v4(),
      amount: 0,
      condition: { type: 'true' as const },
    });
  }

  return result;
}

const useSignalFormStates = ({ slug, quote, setQuote }: TraderInputs) => {
  const isUpdate = useState(false);
  const [amount, setAmount] = useState('0');
  const [leverage, setLeverage] = useState('1');
  const exp = useState('1h');
  const orderExp = useState('1h');
  const maxOrders = useState(100);
  const [takeProfits, setTakeProfits] = useState<TpSlData[]>([]);
  const [stopLosses, setStopLosses] = useState<TpSlData[]>([]);
  const [safetyOpens, setSafetyOpens] = useState<OpenOrderData[]>([]);
  const firing = useState(false);
  const confirming = useState(false);

  const remainingVolume = useMemo(
    () =>
      100 -
      safetyOpens
        .filter(x => !x.removed)
        .reduce((a, b) => a + Number(b.amountRatio), 0),
    [safetyOpens],
  );
  const remainingTpVolume = useMemo(
    () =>
      100 -
      takeProfits
        .filter(x => !x.removed)
        .reduce((a, b) => a + Number(b.amountRatio), 0),
    [takeProfits],
  );
  const remainingSlVolume = useMemo(
    () =>
      100 -
      takeProfits
        .filter(x => !x.removed)
        .reduce((a, b) => a + Number(b.amountRatio), 0),
    [takeProfits],
  );

  const ordersUsed =
    safetyOpens.filter(x => !x.removed).length +
    takeProfits.filter(x => !x.removed).length +
    stopLosses.filter(x => !x.removed).length;

  const result = {
    isOrderLimitReached: ordersUsed >= maxOrders[0],
    isUpdate,
    base: slug,
    quote: [quote, setQuote],
    amount: [amount, setAmount],
    leverage: [leverage, setLeverage],
    exp,
    orderExp,
    maxOrders,
    safetyOpens: [safetyOpens, setSafetyOpens],
    takeProfits: [takeProfits, setTakeProfits],
    stopLosses: [stopLosses, setStopLosses],
    remainingVolume,
    remainingTpVolume,
    remainingSlVolume,
    firing,
    confirming,

    getTakeProfits: () => toApiContract(takeProfits),
    getStopLosses: () => toApiContract(stopLosses),
    getOpenOrders: (
      marketPrice: number,
      remoteOpenOrders: OpenOrderResponse[] = [],
    ) => ({
      items: getSafetyOpens(safetyOpens, remoteOpenOrders, marketPrice),
    }),
    reset: () => {
      isUpdate[1](false);
      setAmount('0');
      maxOrders[1](100);
      setLeverage('1');
      exp[1]('1h');
      orderExp[1]('1h');
      setTakeProfits([]);
      setStopLosses([]);
      setSafetyOpens([]);
    },
  } as const;
  return result;
};

export type SignalFormState = ReturnType<typeof useSignalFormStates>;
export default useSignalFormStates;
