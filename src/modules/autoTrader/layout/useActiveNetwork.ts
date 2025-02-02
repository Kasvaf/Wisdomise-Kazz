import { useMatches, useParams, useSearchParams } from 'react-router-dom';
import { type SupportedNetworks, useSupportedNetworks } from 'api/trader';

const useActiveNetwork = () => {
  let routeWallet = (
    useMatches().find(x => (x.handle as any)?.wallet)?.handle as any
  )?.wallet;

  const params = useParams();
  const [query] = useSearchParams();
  if (typeof routeWallet === 'function') {
    routeWallet = routeWallet(params, Object.fromEntries(query.entries()));
  }

  const isDynamic = Array.isArray(routeWallet);
  const supportedNet = useSupportedNetworks(
    isDynamic ? routeWallet[0] : undefined,
    isDynamic ? routeWallet[1] : undefined,
  )?.[0];

  return typeof routeWallet === 'string'
    ? (routeWallet as SupportedNetworks)
    : supportedNet;
};

export default useActiveNetwork;
