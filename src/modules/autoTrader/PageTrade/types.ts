import { type AutoTraderSupportedQuotes } from 'api/chains';

export interface TraderInputs {
  slug: string;
  positionKey: string;
  quote: AutoTraderSupportedQuotes;
  setQuote: (newVal: AutoTraderSupportedQuotes) => void;
}
