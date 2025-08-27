import { isMiniApp } from 'utils/version';

const STATIC_NETWORK = isMiniApp ? 'the-open-network' : 'solana';

export const getGlobalNetwork = () => STATIC_NETWORK;
export const useGlobalNetwork = () => {
  return [STATIC_NETWORK, (_newNetwork?: string) => STATIC_NETWORK] as const;
};
