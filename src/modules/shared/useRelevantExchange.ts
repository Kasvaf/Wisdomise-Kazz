import { useParams } from 'react-router-dom';
import { NETWORK_MAIN_EXCHANGE, useSupportedNetworks } from 'api';
import useSearchParamAsState from './useSearchParamAsState';

const useRelevantExchange = (base?: string, quote?: string) => {
  const { slug: baseSlug } = useParams<{ slug: string }>();
  const [baseQuote] = useSearchParamAsState('quote', 'tether');
  const network = useSupportedNetworks(
    base || baseSlug,
    quote || baseQuote,
  )?.[0];
  return (network && NETWORK_MAIN_EXCHANGE[network]) || 'BINANCE';
};

export default useRelevantExchange;
