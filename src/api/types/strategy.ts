export interface BareStrategyInfo {
  name: string;
  profile?:
    | {
        title: string;
      }
    | undefined;
}

export interface PairData {
  name: string;
  display_name: string;
  base: { name: string };
  quote: { name: string };
}
