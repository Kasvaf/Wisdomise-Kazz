import { type PageResponse } from './page';

export type StrategiesResponse = PageResponse<Strategy>;

export interface BareStrategyInfo {
  name: string;
  profile?:
    | {
        title: string;
      }
    | undefined;
}

export interface Strategy extends BareStrategyInfo {
  key: string;
  name: string;
  version: string;
  profile: Profile;
  market_name: string;
  resolution: string;
  supported_pairs: SupportedPair[];
}

export interface SupportedPair {
  name: string;
  base: { name: string };
  quote: { name: string };
}

interface Profile {
  'title': string;
  'description': string;
  'position_sides': string[];
  'SL/TP'?: string;
  'subscription_level'?: number;
}
