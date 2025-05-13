import { useAccount } from 'wagmi';
import { notification } from 'antd';
import { useAccountQuery } from 'api';

export function useEnsureWalletConnected() {
  const { address } = useAccount();
  const { data } = useAccountQuery();

  return () => {
    if (address) {
      if (data?.wallet_address && data.wallet_address !== address) {
        notification.error({ message: 'Wrong wallet address is connected' });
      } else {
        return true;
      }
    } else {
      notification.error({ message: 'Please Connect your wallet' });
    }
    return false;
  };
}
