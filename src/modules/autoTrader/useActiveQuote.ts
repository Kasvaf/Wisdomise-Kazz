import { useLocalStorage } from 'usehooks-ts';
import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useSupportedPairs } from 'api';

export const useActiveQuote = () => {
  const localStorage = useLocalStorage('active-quote', 'wrapped-solana');
  const [activeQuote, setActiveQuote] = localStorage;

  const [searchParams] = useSearchParams();
  const { data } = useSupportedPairs(searchParams.get('slug') ?? undefined);
  const firstSupported = data?.[0]?.quote?.slug;
  const isValueSupported = data?.some(x => x.quote.slug === activeQuote);

  useEffect(() => {
    if (firstSupported && !isValueSupported) {
      setActiveQuote(firstSupported);
    }
  }, [firstSupported, isValueSupported, setActiveQuote]);

  return localStorage;
};
