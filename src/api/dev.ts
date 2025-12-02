import { useQuery } from '@tanstack/react-query';

export interface DevTokensResponse {
  total_count: number;
  migrated_count: number;
  tokens: DevToken[];
}

export interface DevToken {
  network: 'solana';
  contract_address: string;
  name: string;
  symbol: string;
  description: string;
  created_at: string;
  dev_address: string;
  mint_authority?: boolean;
  freeze_authority?: boolean;
  total_supply: number;
  decimals: number;
  image_uri?: string;
  website?: string;
  twitter?: string;
  telegram?: string;
  meta_uri?: string;
  is_complete: boolean;
  is_migrated: boolean;
  total_count: number;
  migrated_count: number;
  volume_1h_usd: string;
  market_cap_usd: string;
}

const mock = {
  total_count: 499,
  migrated_count: 2,
  tokens: [
    {
      network: 'solana',
      contract_address: 'F2h1twCMGTJGBpMqYT147jSuuTpkESDbHp1cMz6hck7W',
      name: 'Kalshi Phygital Companion',
      symbol: 'TOFUCHAN',
      description: 'Deployed using https://j7tracker.com',
      created_at: '2025-12-01T21:29:25.791Z',
      dev_address: 'G1TyYBvobLkWLYMVUJKYWFeb8NhkUEsDZhYKbXaWL3uc',
      mint_authority: undefined,
      freeze_authority: undefined,
      total_supply: 1_000_000_000,
      decimals: 6,
      image_uri:
        'https://cdn-trench.goatx.trade/gGphaulXXcm_0e69szbodeLwx4w_PWMu4JxkcTV-6wg/s:80:80/aHR0cHM6Ly9heGlvbXRyYWRpbmcuc2ZvMy5jZG4uZGlnaXRhbG9jZWFuc3BhY2VzLmNvbS83WGhETHQ3Nk1nY01LRkdiOW5XV3A4cWNLVWF0cUM3ZDlOQ2F1OEx3VjdHYS53ZWJw',
      website: 'https://www.tofuchan.io/',
      twitter: 'https://x.com/OnChainDaVinci/status/1995606147534029235',
      telegram: undefined,
      meta_uri: 'https://metadata.j7tracker.com/metadata/e737ed9c0ca8463d.json',
      is_complete: true,
      is_migrated: false,
      total_count: 499,
      migrated_count: 2,
      volume_1h_usd: '0',
      market_cap_usd: '3556.0079570335885',
    },
  ],
} as DevTokensResponse;

export const useDevTokensQuery = ({ devAddress }: { devAddress?: string }) => {
  return useQuery({
    queryKey: ['dev-tokens', devAddress],
    queryFn: async () => {
      return mock;
      // const data = await ofetch<DevTokensResponse>(
      //   `https://stage-network-radar.wisdomise.com/v1/dev-tokens?dev_address=${devAddress}`,
      // );
      // return data;
    },
    staleTime: 60 * 1000,
  });
};
