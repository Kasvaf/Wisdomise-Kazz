export interface TraderInputs {
  positionKey?: string;
  slug: string;
  quote: string;
  setQuote: (newVal: string) => void;
}
