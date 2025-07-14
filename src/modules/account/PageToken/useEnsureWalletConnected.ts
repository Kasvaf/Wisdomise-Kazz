import { notification } from 'antd';
import { useAccountQuery } from 'api';

import { useActiveWallet } from 'api/chains/wallet';

export function useEnsureWalletConnected() {
  const { data } = useAccountQuery();
  const wallet = useActiveWallet();

  return async () => {
    if (!wallet.connected && !(await wallet.connect())) return;

    if (
      data?.wallet_address &&
      data.wallet_address.toLowerCase() !== wallet.address?.toLowerCase()
    ) {
      notification.error({ message: 'Wrong wallet address is connected' });
      return false;
    }

    return true;
  };
}
