import { useWaitForTransaction } from 'wagmi';
import { useEffect } from 'react';
import { notification } from 'antd';
import { useWriteUnlock } from 'modules/account/PageToken/web3/locking/contract';

export function useUnlock() {
  const { write, data: result, isLoading, error } = useWriteUnlock();
  const { data: trxReceipt, isLoading: isWaiting } = useWaitForTransaction({
    hash: result?.hash,
    enabled: !!result?.hash,
  });

  useEffect(() => {
    if (error) {
      notification.error({ message: error.message });
    }
  }, [error]);

  return {
    unlock: write,
    isLoading: isLoading || isWaiting,
    trxReceipt,
    error,
  };
}
