import { useAccount, useWaitForTransaction } from 'wagmi';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { notification } from 'antd';
import {
  useReadWsdmAllowance,
  useWriteWsdmApprove,
} from 'modules/account/PageToken/web3/wsdm/wsdmContract';
import {
  LOCKING_CONTRACT_ADDRESS,
  useWriteLock,
} from 'modules/account/PageToken/web3/locking/contract';

export function useLocking() {
  const { address } = useAccount();
  const { data: allowance, refetch: refetchAllowance } = useReadWsdmAllowance(
    LOCKING_CONTRACT_ADDRESS,
  );
  const [amount, setAmount] = useState<bigint>();

  const {
    write: lock,
    data: lockResult,
    isLoading: lockIsLoading,
    error: LockError,
  } = useWriteLock();
  const { data: lockTrxReceipt, isLoading: lockTrxIsLoading } =
    useWaitForTransaction({ hash: lockResult?.hash });

  const {
    write: approve,
    isLoading: approveIsLoading,
    data: approveResult,
  } = useWriteWsdmApprove();
  const { data: approveTrxReceipt, isLoading: approveTrxIsLoading } =
    useWaitForTransaction({ hash: approveResult?.hash });

  const handleLocking = (amount: number) => {
    setAmount(BigInt(amount));
    if (!isAllowed(allowance, BigInt(amount)) && address) {
      approve({
        args: [LOCKING_CONTRACT_ADDRESS, BigInt(amount) ?? 0n],
      });
    } else {
      lock();
    }
  };

  const isAllowed = (allowance?: bigint, balance?: bigint) => {
    return (allowance ?? 0n) >= (balance ?? 0n);
  };

  const checkForMigration = useCallback(async () => {
    if (approveTrxReceipt?.status === 'success') {
      const { data: currentAllowance } = await refetchAllowance();
      if (isAllowed(currentAllowance, amount)) {
        lock();
      } else {
        notification.error({
          message: 'Allowance cap is less than your utility price.',
        });
      }
    } else if (approveTrxReceipt?.status === 'reverted') {
      notification.error({
        message: 'Approve transaction reverted.',
      });
    }
  }, [amount, approveTrxReceipt?.status, lock, refetchAllowance]);

  useEffect(() => {
    void checkForMigration();
  }, [approveTrxReceipt?.status, lock, refetchAllowance, checkForMigration]);

  useEffect(() => {
    if (lockTrxReceipt?.status === 'success') {
      notification.success({
        message: 'Your tokens locked successfully',
      });
    }
  }, [lockTrxReceipt]);

  useEffect(() => {
    if (LockError) {
      notification.error({
        message: LockError.message,
      });
    }
  }, [LockError]);

  const isLoading = useMemo(
    () =>
      approveIsLoading ||
      approveTrxIsLoading ||
      lockIsLoading ||
      lockTrxIsLoading,
    [approveIsLoading, approveTrxIsLoading, lockIsLoading, lockTrxIsLoading],
  );

  return { handleLocking, isLoading, lockTrxReceipt };
}
