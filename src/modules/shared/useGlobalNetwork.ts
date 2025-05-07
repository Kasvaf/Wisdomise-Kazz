import { useLocalStorage } from 'usehooks-ts';
import { isMiniApp } from 'utils/version';

const DEFAULT_NETWORK = isMiniApp ? 'the-open-network' : 'solana';

export const useGlobalNetwork = () => {
  const [slug, setSlug] = useLocalStorage('network', DEFAULT_NETWORK);

  return [
    isMiniApp ? DEFAULT_NETWORK : slug ?? DEFAULT_NETWORK,
    setSlug,
  ] as const;
};
