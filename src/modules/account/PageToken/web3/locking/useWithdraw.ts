import { notification } from 'antd';
import { useEnsureWalletConnected } from 'modules/account/PageToken/useEnsureWalletConnected';
import { useWriteWithdraw } from 'modules/account/PageToken/web3/locking/contract';
import { useUtility } from './useUtility';

export function useWithdraw() {
  const { refetchUnlockedInfo, refetchLockedInfo } = useUtility();
  const { writeAndWait, isPending, isWaiting } = useWriteWithdraw();
  const ensureWalletConnected = useEnsureWalletConnected();

  const withdraw = async () => {
    if (await ensureWalletConnected()) {
      await writeAndWait();
      notification.success({
        message: 'You claimed your tokens successfully.',
      });
      void refetchUnlockedInfo();
      void refetchLockedInfo();
    }
  };

  return {
    withdraw,
    isPending,
    isWaiting,
  };
}
