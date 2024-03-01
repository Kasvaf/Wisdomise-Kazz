import { type PairData } from './types/strategy';

const normalizePair = (a: any): PairData => {
  if (typeof a === 'string') {
    let [base, quote] = a.split('/');
    base = base.replace(/USDT$/, '');
    quote ||= 'USDT';
    return {
      name: a,
      display_name: base,
      base: { name: base },
      quote: { name: quote },
    };
  }

  const name = a.name || a.symbol?.name || a.pair?.name;

  const title =
    a.display_name || a.symbol?.title || a.pair?.base?.title || a.title || name;

  const baseName =
    a.base_name ||
    a.base?.name ||
    a.symbol?.name ||
    a.pair?.base?.name ||
    a.symbol ||
    name.split('/')[0].replace(/USDT$/, '');

  const quoteName =
    a.quote_name ||
    a.quote?.name ||
    a.pair?.quote.name ||
    a.symbol?.quote?.name ||
    name.split('/')[1] ||
    'USDT';

  return {
    name,
    display_name: title,
    base: { name: baseName },
    quote: { name: quoteName },
  };
};

export default normalizePair;
