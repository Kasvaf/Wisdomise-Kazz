import { useState } from 'react';

export interface TpSlData {
  key: string;
  amountRatio: string;
  priceExact: string;
  applied: boolean;
}

function toApiContract(items: TpSlData[]) {
  return {
    items: items.map(x => ({
      key: x.key,
      amount_ratio: +x.amountRatio / 100,
      price_exact: +x.priceExact,
    })),
  };
}

const useSignalFormStates = () => {
  const result = {
    isUpdate: useState(false),

    market: useState<'long' | 'short'>('long'),
    orderType: useState<'limit' | 'market'>('market'),
    price: useState(''),

    exp: useState('1h'),
    orderExp: useState('1h'),

    takeProfits: useState<TpSlData[]>([]),
    stopLosses: useState<TpSlData[]>([]),

    getTakeProfits: () => toApiContract(result.takeProfits[0]),
    getStopLosses: () => toApiContract(result.stopLosses[0]),
  };
  return result;
};

export type SignalFormState = ReturnType<typeof useSignalFormStates>;
export default useSignalFormStates;
