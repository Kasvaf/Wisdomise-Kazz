import { useLocalStorage } from 'usehooks-ts';
import { isMiniApp } from 'utils/version';

export const useGlobalNetwork = () => {
  const [slug, setSlug] = useLocalStorage<string | undefined>(
    'network',
    'solana',
  );

  return [isMiniApp ? 'the-open-network' : slug, setSlug] as const;
};
