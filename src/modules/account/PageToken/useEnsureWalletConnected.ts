import { useAccount, useSwitchChain } from 'wagmi';
import { notification } from 'antd';
import { useAccountQuery } from 'api';
import { polygonChain } from 'config/appKit';

export function useEnsureWalletConnected() {
  const { address, chain } = useAccount();
  const { data } = useAccountQuery();
  const { switchChainAsync } = useSwitchChain();

  return () =>
    new Promise(resolve => {
      if (address) {
        if (
          data?.wallet_address &&
          data.wallet_address.toLowerCase() !== address.toLowerCase()
        ) {
          notification.error({ message: 'Wrong wallet address is connected' });
          resolve(false);
        } else {
          const suitableChainId = polygonChain.id;
          if (chain?.id === suitableChainId) {
            resolve(true);
          } else {
            void switchChainAsync({ chainId: suitableChainId }).then(() =>
              resolve(true),
            );
          }
        }
      } else {
        notification.error({ message: 'Please Connect your wallet' });
        resolve(false);
      }
    });
}
