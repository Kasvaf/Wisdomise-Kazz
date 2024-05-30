import { useState } from 'react';

interface TpSlData {
  key: string;
  amountRatio: number;
  priceExact: number;
}

const useSignalFormStates = () => {
  return {
    hasOpen: useState(true),
    market: useState<'long' | 'short'>('long'),
    orderType: useState<'limit' | 'market'>('market'),
    price: useState(''),

    exp: useState('1h'),
    orderExp: useState('1h'),

    hasTakeProfit: useState(true),
    takeProfits: useState<TpSlData[]>([]),
    hasStopLosses: useState(true),
    stopLosses: useState<TpSlData[]>([]),
  };
};

export type SignalFormState = ReturnType<typeof useSignalFormStates>;
export default useSignalFormStates;
