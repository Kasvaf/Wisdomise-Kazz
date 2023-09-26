import { type PageResponse } from './page';

export type StrategiesResponse = PageResponse<Strategy>;

export interface Strategy {
  key: string;
  name: string;
  version: string;
  profile: Profile;
  market_name: string;
  resolution: string;
  supported_pairs: SupportedPair[];
}

interface SupportedPair {
  name: string;
  base_name: string;
  quote_name: string;
}

interface Profile {
  'title': string;
  'description': string;
  'position_sides': string[];
  'SL/TP'?: string;
}
