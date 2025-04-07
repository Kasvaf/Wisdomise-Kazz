import { load } from 'dldr';
import { useQuery } from '@tanstack/react-query';
import { ofetch } from 'config/ofetch';
import { type Coin } from './types/shared';

const cachedCoinsMap: Record<string, Coin> = {};

const getCoins = async (slugs: string[]) => {
  const data = await ofetch<Coin[]>('delphi/symbol/search/', {
    query: { slugs: slugs.filter(x => !cachedCoinsMap[x]).join(',') },
  });
  Object.assign(cachedCoinsMap, Object.fromEntries(data.map(x => [x.slug, x])));
  return slugs.map(x => cachedCoinsMap[String(x)]);
};

export const useSymbolInfo = (slug?: string) => {
  const s = slug === 'wrapped-solana' ? 'solana' : slug;
  return useQuery({
    queryKey: ['symbol-info', s],
    queryFn: async () => (s && (await load(getCoins, s))) || null,
    staleTime: Number.POSITIVE_INFINITY,
  });
};
