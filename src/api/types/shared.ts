export type MarketTypes = 'SPOT' | 'FUTURES';

export interface Coin {
  abbreviation?: string;
  name?: string;
  slug: string;
  logo_url?: string | null;
  categories?: null | Array<{
    name: string;
    slug: string;
  }>;
}
