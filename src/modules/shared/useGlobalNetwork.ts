import { useLocalStorage } from 'usehooks-ts';

const DEFAULT_NETWORK = 'solana';

export const useGlobalNetwork = () => {
  const [slug, setSlug] = useLocalStorage('network', DEFAULT_NETWORK);

  return [slug ?? DEFAULT_NETWORK, setSlug] as const;
};
