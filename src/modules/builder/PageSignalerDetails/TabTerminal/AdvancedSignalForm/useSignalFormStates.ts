import { v4 } from 'uuid';
import { useState } from 'react';

export interface TpSlData {
  key: string;
  amountRatio: string;
  priceExact: string;
  applied: boolean;
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

const useSignalFormStates = () => {
  const isUpdate = useState(false);
  const market = useState<'long' | 'short'>('long');
  const orderType = useState<'limit' | 'market'>('market');
  const price = useState('');
  const priceUpdated = useState(false);
  const exp = useState('1h');
  const orderExp = useState('1h');
  const [takeProfits, setTakeProfits] = useState<TpSlData[]>([]);
  const [stopLosses, setStopLosses] = useState<TpSlData[]>([]);

  const result = {
    isUpdate,
    market,
    orderType,
    price,
    priceUpdated,
    exp,
    orderExp,
    takeProfits: [takeProfits, setTakeProfits] as const,
    stopLosses: [stopLosses, setStopLosses] as const,

    getTakeProfits: () => toApiContract(takeProfits),
    getStopLosses: () => toApiContract(stopLosses),
  };
  return result;
};

export type SignalFormState = ReturnType<typeof useSignalFormStates>;
export default useSignalFormStates;
