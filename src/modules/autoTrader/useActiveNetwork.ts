import { useMatches, useParams } from 'react-router-dom';
import { useSupportedNetworks } from 'api';
import useSearchParamAsState from 'shared/useSearchParamAsState';

// TODO: refactor merge with useRelevantExchange
const useActiveNetwork = () => {
  const { slug: baseSlug } = useParams<{ slug: string }>();
  const [quote] = useSearchParamAsState('quote', 'tether');
  const pageNeedsWallet =
    useMatches().some(x => (x.handle as any)?.wallet) && !!baseSlug;
  return useSupportedNetworks(
    pageNeedsWallet ? baseSlug : undefined,
    quote,
  )?.[0];
};

export default useActiveNetwork;
