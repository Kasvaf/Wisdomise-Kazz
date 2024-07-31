import { v4 } from 'uuid';
import { useState } from 'react';
import {
  type OpenOrderInput,
  type OpenOrderCondition,
  type OpenOrderResponse,
} from 'api/builder';

export interface TpSlData {
  key: string;
  amountRatio: string;
  priceExact: string;
  applied: boolean;
  appliedAt?: Date;
  removed: boolean;
}

function toApiContract(items: TpSlData[]) {
  return {
    items: items
      .filter(x => !x.removed)
      .map(x => ({
        key: x.applied ? x.key : v4(),
        amount_ratio: +x.amountRatio / 100,
        price_exact: +x.priceExact,
      })),
  };
}

export function sortTpSlItems({
  items,
  type,
  market,
}: {
  items: TpSlData[];
  type: 'TP' | 'SL';
  market: 'long' | 'short';
}) {
  return [...items].sort(
    (a, b) =>
      (+a.priceExact - +b.priceExact) *
      (type === 'TP' ? 1 : -1) *
      (market === 'long' ? 1 : -1),
  );
}

function getSafetyOpens(orders: TpSlData[], effectivePrice: number) {
  return orders
    .filter(x => !x.removed)
    .map(
      x =>
        ({
          key: x.applied ? x.key : v4(),
          amount: +x.amountRatio / 100,
          order_type: 'market',
          condition: {
            type: 'compare',
            op: +x.priceExact < effectivePrice ? '<=' : '>=',
            left: 'price',
            right: +x.priceExact,
          },
        }) as const,
    );
}

const useSignalFormStates = () => {
  const isUpdate = useState(false);
  const market = useState<'long' | 'short'>('long');
  const [orderType, setOrderType] = useState<'limit' | 'market'>('market');
  const [price, setPrice] = useState('');
  const priceUpdated = useState(false);
  const [volume, setVolume] = useState('100');
  const [conditions, setConditions] = useState<OpenOrderCondition[]>([]);
  const exp = useState('1h');
  const orderExp = useState('1h');
  const [takeProfits, setTakeProfits] = useState<TpSlData[]>([]);
  const [stopLosses, setStopLosses] = useState<TpSlData[]>([]);
  const [safetyOpens, setSafetyOpens] = useState<TpSlData[]>([]);

  const result = {
    isUpdate,
    market,
    orderType: [orderType, setOrderType],
    price: [price, setPrice],
    priceUpdated,
    volume: [volume, setVolume],
    conditions: [conditions, setConditions],
    exp,
    orderExp,
    takeProfits: [takeProfits, setTakeProfits],
    stopLosses: [stopLosses, setStopLosses],
    safetyOpens: [safetyOpens, setSafetyOpens],

    getTakeProfits: () => toApiContract(takeProfits),
    getStopLosses: () => toApiContract(stopLosses),
    getOpenOrders: (
      effectivePrice: number,
      firstOrder?: OpenOrderResponse,
    ) => ({
      items: [
        firstOrder?.applied
          ? {
              key: firstOrder.key,
              condition: firstOrder.condition,
              amount: +volume / 100,
              price:
                orderType === 'limit'
                  ? { value: Number(firstOrder.price) }
                  : undefined,
              order_type: orderType,
            }
          : {
              key: v4(),
              condition:
                orderType === 'limit' || conditions.length === 0
                  ? { type: 'true' as const }
                  : conditions[0],
              amount: +volume / 100,
              price:
                orderType === 'limit'
                  ? { value: Number.parseFloat(price) }
                  : undefined,
              order_type: orderType,
            },
        ...(+volume < 100 ? getSafetyOpens(safetyOpens, effectivePrice) : []),
      ] satisfies OpenOrderInput[],
    }),
    reset: () => {
      isUpdate[1](false);
      market[1]('long');
      setOrderType('market');
      setPrice('');
      priceUpdated[1](false);
      setVolume('100');
      setConditions([]);
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
