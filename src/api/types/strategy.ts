export interface BareStrategyInfo {
  name: string;
  profile?:
    | {
        title: string;
      }
    | undefined;
}

export interface SupportedPair {
  name: string;
  base: { name: string };
  quote: { name: string };
}
