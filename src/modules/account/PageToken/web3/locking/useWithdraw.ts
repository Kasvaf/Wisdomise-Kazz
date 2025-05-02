import { notification } from 'antd';
import { useWriteWithdraw } from 'modules/account/PageToken/web3/locking/contract';
import { useUtility } from './useUtility';

export function useWithdraw() {
  const { refetchUnlockedInfo, refetchLockedInfo } = useUtility();
  const { writeAndWait, isPending, isWaiting } = useWriteWithdraw();

  const withdraw = async () => {
    await writeAndWait();
    notification.success({
      message: 'You claimed your tokens successfully.',
    });
    void refetchUnlockedInfo();
    void refetchLockedInfo();
  };

  return {
    withdraw,
    isPending,
    isWaiting,
  };
}
