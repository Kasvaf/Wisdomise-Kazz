import { useAccount, useSwitchChain } from 'wagmi';
import { notification } from 'antd';
import { useEffect, useRef } from 'react';
import { useAccountQuery } from 'api';
import { appKitModal, defaultChain } from 'config/wagmi';

export function useEnsureWalletConnected() {
  const { address, chain } = useAccount();
  const { data } = useAccountQuery();
  const { switchChainAsync } = useSwitchChain();
  const resolveRef = useRef<((result: boolean) => void) | null>(null);

  useEffect(() => {
    if (address) {
      resolveRef.current?.(true);
      resolveRef.current = null;
    }
  }, [address]);

  return () =>
    new Promise<boolean>(resolve => {
      resolveRef.current = resolve;
      if (address) {
        if (
          data?.wallet_address &&
          data.wallet_address.toLowerCase() !== address.toLowerCase()
        ) {
          notification.error({ message: 'Wrong wallet address is connected' });
          resolve(false);
        } else {
          const suitableChainId = defaultChain.id;
          if (chain?.id === suitableChainId) {
            resolve(true);
          } else {
            void switchChainAsync({ chainId: suitableChainId }).then(() =>
              resolve(true),
            );
          }
        }
      } else {
        void appKitModal.open();
      }
    });
}
