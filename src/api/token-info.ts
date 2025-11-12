import { useQuery } from '@tanstack/react-query';
import { WRAPPED_SOLANA_CONTRACT_ADDRESS } from 'api/chains/constants';
import { ofetch } from 'config/ofetch';
import { load } from 'dldr';

type TokenInfoResponse = Record<string, TokenInfo>;

export interface TokenInfo {
  network: 'solana';
  contract_address: string;
  name?: string;
  symbol?: string;
  description?: string;
  created_at: string;
  dev_address: string;
  mint_authority?: unknown;
  freeze_authority?: unknown;
  total_supply: number;
  decimals: number;
  image_uri: string;
  website?: string;
  twitter?: string;
  telegram?: string;
  meta_uri: string;
}

const SOLANA_TOKEN_INFO = {
  network: 'solana',
  contract_address: WRAPPED_SOLANA_CONTRACT_ADDRESS,
  name: 'Solana',
  symbol: 'SOL',
  decimals: 6,
  image_uri:
    'https://coin-images.coingecko.com/coins/images/4128/large/solana.png?1718769756',
} as TokenInfo;

export const slugToTokenAddress = (slug?: string | null) => {
  if (!slug) return '';
  return slug.startsWith('solana_') ? slug.slice(7) : slug;
};

export const tokenAddressToSlug = (address?: string | null) => {
  return `solana_${address}`;
};

const cachedTokens: Record<string, TokenInfo> = {
  [WRAPPED_SOLANA_CONTRACT_ADDRESS]: SOLANA_TOKEN_INFO,
};
const getTokens = async (tokenAddresses: string[]) => {
  const unseenSlugs = tokenAddresses.filter(x => !cachedTokens[x]);
  if (unseenSlugs.length > 0) {
    const data = await ofetch<TokenInfoResponse>(
      'network-radar/token-info/?network=solana',
      {
        query: { token_address: tokenAddresses.join(',') },
      },
    );
    delete data[WRAPPED_SOLANA_CONTRACT_ADDRESS];
    Object.assign(cachedTokens, data);
  }
  return tokenAddresses.map(x => cachedTokens[String(x)]);
};

export const useTokenInfo = ({
  slug,
  tokenAddress,
  enabled = true,
}: {
  slug?: string;
  tokenAddress?: string;
  enabled?: boolean;
}) => {
  const address = tokenAddress || slugToTokenAddress(slug);

  return useQuery({
    queryKey: ['token-info', address],
    queryFn: async () => (address && (await load(getTokens, address))) || null,
    enabled,
    staleTime: 30 * 1000,
  });
};

export const useTokensInfo = ({
  slugs,
  tokenAddresses,
}: {
  slugs?: string[];
  tokenAddresses?: string[];
}) => {
  const addresses = tokenAddresses ?? slugs?.map(slugToTokenAddress);

  return useQuery({
    queryKey: ['tokens-info', slugs],
    queryFn: async () =>
      (await Promise.all(
        addresses!.map(address => load(getTokens, address)),
      )) as (TokenInfo | null)[],
    staleTime: Number.POSITIVE_INFINITY,
    enabled: (addresses?.length ?? 0) > 0,
  });
};
