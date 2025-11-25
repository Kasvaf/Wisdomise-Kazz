import { notification } from 'antd';
import { useActiveWallet } from 'services/chains/wallet';
import { useAccountQuery } from 'services/rest';

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
