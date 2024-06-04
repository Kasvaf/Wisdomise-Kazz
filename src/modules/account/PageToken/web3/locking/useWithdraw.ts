import { useWaitForTransaction } from 'wagmi';
import { useEffect } from 'react';
import { notification } from 'antd';
import { useWriteWithdraw } from 'modules/account/PageToken/web3/locking/contract';
import { extractWagmiErrorMessage } from 'utils/error';
import { useUtility } from './useUtility';

export function useWithdraw() {
  const { refetchUnlockedInfo, refetchLockedInfo } = useUtility();
  const { write, data: result, isLoading, error } = useWriteWithdraw();
  const { data: trxReceipt, isLoading: isWaiting } = useWaitForTransaction({
    hash: result?.hash,
    enabled: !!result?.hash,
  });

  useEffect(() => {
    if (error) {
      notification.error({ message: extractWagmiErrorMessage(error.message) });
    }
  }, [error]);

  useEffect(() => {
    if (trxReceipt?.status === 'success') {
      notification.success({
        message: 'You claimed your tokens successfully.',
      });
      void refetchUnlockedInfo();
      void refetchLockedInfo();
    }
  }, [refetchLockedInfo, refetchUnlockedInfo, trxReceipt]);

  return {
    withdraw: write,
    isLoading: isLoading || isWaiting,
    trxReceipt,
    error,
  };
}
