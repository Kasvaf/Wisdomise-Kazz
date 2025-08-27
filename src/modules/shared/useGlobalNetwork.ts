import { useLocalStorage } from 'usehooks-ts';
import { isMiniApp } from 'utils/version';

export const getGlobalNetwork = () =>
  localStorage.getItem('network') || 'solana';

export const useGlobalNetwork = () => {
  const [slug, setSlug] = useLocalStorage<string>('network', 'solana');

  return [isMiniApp ? 'the-open-network' : slug, setSlug] as const;
};
