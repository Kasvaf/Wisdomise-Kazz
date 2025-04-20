import { type AutoTraderSupportedQuotes } from 'api/chains';

export interface QuickSwapInputs {
  slug: string;
  quote?: string;
  setQuote: (newVal: AutoTraderSupportedQuotes) => void;
}
