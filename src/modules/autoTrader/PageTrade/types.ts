export interface TraderInputs {
  slug: string;
  positionKey?: string;
  quote: string;
  setQuote: (newVal: string) => void;
}
