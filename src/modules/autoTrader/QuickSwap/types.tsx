import { type AutoTraderSupportedQuotes } from 'api/chains';

export interface QuickSwapInputs {
  positionKey?: string;
  slug: string;
  quote?: string;
  setQuote: (newVal: AutoTraderSupportedQuotes) => void;
}
