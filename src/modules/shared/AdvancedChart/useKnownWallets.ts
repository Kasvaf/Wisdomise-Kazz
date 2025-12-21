import { useUnifiedCoinDetails } from 'modules/discovery/DetailView/CoinDetail/lib';
import { useTrackedWallets } from 'modules/discovery/ListView/WalletTracker/useTrackedWallets';
import { useMemo } from 'react';
import { useUserWallets } from 'services/chains/wallet';
import { useKolWallets } from 'services/rest/kol';

export const useKnownWallets = () => {
  const { developer } = useUnifiedCoinDetails();
  const trackedWallets = useTrackedWallets();
  const { data: kolWallets } = useKolWallets({});
  const userWallets = useUserWallets();

  return useMemo(() => {
    return [
      ...(developer ? [developer.address] : []),
      ...trackedWallets.map(t => t.address),
      ...(kolWallets ? kolWallets.map(k => k.wallet_address) : []),
      ...userWallets,
    ];
  }, [developer, trackedWallets, kolWallets, userWallets]);
};
