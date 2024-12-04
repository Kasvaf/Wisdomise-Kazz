import axios from 'axios';
import { load } from 'dldr';
import { useQuery } from '@tanstack/react-query';
import { type Coin } from './types/shared';

const getCoins = async (slugs: unknown[]) => {
  const { data } = await axios.get<Coin[]>('delphi/symbol/search/', {
    params: { slugs: slugs.join(',') },
  });
  const coinMap: Record<string, Coin> = Object.fromEntries(
    data.map(x => [x.slug, x]),
  );
  return slugs.map(x => coinMap[String(x)]);
};

export const useSymbolInfo = (slug: string) => {
  return useQuery(['symbol-info', slug], () => load(getCoins, slug));
};
