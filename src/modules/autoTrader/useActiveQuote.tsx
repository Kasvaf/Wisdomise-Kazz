import {
  createContext,
  type Dispatch,
  type PropsWithChildren,
  type SetStateAction,
  useContext,
  useEffect,
  useState,
} from 'react';
import { useSearchParams } from 'react-router-dom';
import { useSupportedPairs } from 'api';

const context = createContext<
  | [string, Dispatch<SetStateAction<string>>, Dispatch<SetStateAction<string>>]
  | undefined
>(undefined);

export const useActiveQuote = () => {
  const c = useContext(context);
  if (!c) {
    throw new Error('useActiveQuote must be used within ActiveQuoteProvider');
  }
  return c;
};

export const ActiveQuoteProvider = ({ children }: PropsWithChildren) => {
  const [activeQuote, setActiveQuote] = useState('wrapped-solana');
  const [searchParams] = useSearchParams();
  const [baseSlug, setBaseSlug] = useState<string>('');
  const { data } = useSupportedPairs(searchParams.get('slug') || baseSlug);

  const firstSupported = data?.[0]?.quote?.slug;
  const isValueSupported = data
    ? data?.some(x => x.quote.slug === activeQuote)
    : true;

  // biome-ignore lint/correctness/useExhaustiveDependencies: <reason>
  useEffect(() => {
    if (firstSupported && !isValueSupported) {
      setActiveQuote(firstSupported);
    }
  }, [firstSupported, isValueSupported, setActiveQuote]);

  return (
    <context.Provider value={[activeQuote, setActiveQuote, setBaseSlug]}>
      {children}
    </context.Provider>
  );
};
