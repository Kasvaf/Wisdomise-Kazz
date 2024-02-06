import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { type Quote } from './types/investorAssetStructure';

export interface SignalerPair {
  base: Quote;
  quote: Quote;
  name: string;
  display_name: string;
}

export const useSignalerPairs = () =>
  useQuery<SignalerPair[]>(
    ['signaler-pairs'],
    async () => {
      const { data } = await axios.get<SignalerPair[]>('strategy/pairs');
      return data;
    },
    {
      staleTime: Number.POSITIVE_INFINITY,
    },
  );
