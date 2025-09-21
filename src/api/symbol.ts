import { useQuery } from '@tanstack/react-query';
import { ofetch } from 'config/ofetch';
import { load } from 'dldr';
import type { Coin } from './types/shared';

interface SymbolNetwork {
  network: {
    name: string;
    slug: string;
    icon_url: string;
  };
  contract_address: string;
  symbol_network_type: 'TOKEN' | 'COIN';
  decimals: number;
}

export interface CoinSymbol extends Coin {
  networks: SymbolNetwork[];
}

const cachedCoinsMap: Record<string, CoinSymbol> = {};

const getCoins = async (slugs: string[]) => {
  const unseenSlugs = slugs.filter(x => !cachedCoinsMap[x]);
  if (unseenSlugs.length > 0) {
    const data = await ofetch<CoinSymbol[]>('delphi/symbol/search/', {
      query: { slugs: unseenSlugs.join(',') },
    });
    Object.assign(
      cachedCoinsMap,
      Object.fromEntries(data.map(x => [x.slug, x])),
    );
  }
  return slugs.map(x => cachedCoinsMap[String(x)]);
};

export const useSymbolInfo = ({
  slug,
  enabled = true,
}: {
  slug?: string;
  enabled?: boolean;
}) => {
  const s = slug === 'wrapped-solana' ? 'solana' : slug;

  return useQuery({
    queryKey: ['symbol-info', s],
    queryFn: async () => (s && (await load(getCoins, s))) || null,
    staleTime: Number.POSITIVE_INFINITY,
    enabled,
  });
};

export const useSolanaSymbol = () => {
  return useSymbolInfo({ slug: 'wrapped-solana' });
};

export const useSymbolsInfo = (slugs: string[] = []) => {
  return useQuery({
    queryKey: ['symbols-info', slugs],
    queryFn: async () =>
      (await Promise.all(
        slugs.map(slug =>
          load(getCoins, slug === 'wrapped-solana' ? 'solana' : slug),
        ),
      )) as (CoinSymbol | null)[],
    staleTime: Number.POSITIVE_INFINITY,
    enabled: slugs.length > 0,
  });
};
