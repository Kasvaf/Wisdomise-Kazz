import { load } from 'dldr';
import { useQuery } from '@tanstack/react-query';
import { ofetch } from 'config/ofetch';
import { type Coin } from './types/shared';

const getCoins = async (slugs: unknown[]) => {
  const data = await ofetch<Coin[]>('delphi/symbol/search/', {
    query: { slugs: slugs.join(',') },
  });
  const coinMap: Record<string, Coin> = Object.fromEntries(
    data.map(x => [x.slug, x]),
  );
  return slugs.map(x => coinMap[String(x)]);
};

export const useSymbolInfo = (slug: string) => {
  return useQuery(
    ['symbol-info', slug],
    async () => (await load(getCoins, slug)) || null,
  );
};
