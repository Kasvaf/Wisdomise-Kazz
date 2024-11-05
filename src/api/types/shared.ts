export interface Coin {
  abbreviation: string;
  name: string;
  slug?: string | null;
  logo_url?: string | null;
  categories?: null | Array<{
    name: string;
    coingecko_id: string;
  }>;
}

export type MarketTypes = 'SPOT' | 'FUTURES';
