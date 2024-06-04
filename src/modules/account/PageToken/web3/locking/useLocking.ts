import { useWaitForTransaction } from 'wagmi';
import { useEffect } from 'react';
import { notification } from 'antd';
import { hexToNumber, toHex } from 'viem';
import { secp256k1 } from '@noble/curves/secp256k1';
import { useWsdmSignTypedDataForLocking } from 'modules/account/PageToken/web3/wsdm/contract';
import {
  useWriteLock,
  useWriteLockWithPermit,
} from 'modules/account/PageToken/web3/locking/contract';
import { extractWagmiErrorMessage, isUserRejectionError } from 'utils/error';
import {
  LOCKING_CONTRACT_ADDRESS,
  WSDM_CONTRACT_ADDRESS,
} from '../../constants';
import { useIncreaseAllowance } from '../shared';

export function useLocking() {
  const { sign, isLoading: isSigning } = useWsdmSignTypedDataForLocking();
  const {
    startLockingWithPermit,
    lockTrxReceipt: lockWithPermitTrxReceipt,
    isLoading: lockWithPermitIsLoading,
    isLocking: lockWithPermitIsLocking,
  } = useLockWithPermit();

  const {
    startLockingWithApprove,
    lockTrxReceipt: lockWithApproveTrxReceipt,
    isLoading: lockWithApproveIsLoading,
    isLocking: lockWithApproveIsLocking,
  } = useLockWithApprove();

  const startLocking = async (amount: number, countdown: number) => {
    const deadline = Math.floor(Date.now() / 1000) + countdown;
    sign(amount * 10 ** 6, deadline)
      .then(signature => {
        startLockingWithPermit(signature, BigInt(amount * 10 ** 6), deadline);
        return null;
      })
      .catch(error => {
        if (!isUserRejectionError(error.message)) {
          startLockingWithApprove();
        }
      });
  };

  return {
    startLocking,
    isLoading: isSigning || lockWithPermitIsLoading || lockWithApproveIsLoading,
    isLocking: lockWithPermitIsLocking || lockWithApproveIsLocking,
    lockTrxReceipt: lockWithPermitTrxReceipt || lockWithApproveTrxReceipt,
  };
}

export function useLockWithPermit() {
  const {
    write: lockWithPermit,
    data: lockResult,
    isLoading,
    error,
  } = useWriteLockWithPermit();
  const { data: lockTrxReceipt, isLoading: isWaiting } = useWaitForTransaction({
    hash: lockResult?.hash,
  });

  const startLockingWithPermit = (
    signature: `0x${string}`,
    amount: bigint,
    deadline: number,
  ) => {
    const { r, s } = secp256k1.Signature.fromCompact(signature.slice(2, 130));
    const v = hexToNumber(`0x${signature.slice(130)}`);
    lockWithPermit({
      args: [amount, amount, BigInt(deadline), v, toHex(r), toHex(s)],
    });
  };

  useEffect(() => {
    if (lockTrxReceipt?.status === 'success') {
      notification.success({
        message: 'Your tokens are locked successfully',
      });
    }
  }, [lockTrxReceipt]);

  useEffect(() => {
    if (error) {
      notification.error({
        message: extractWagmiErrorMessage(error.message),
      });
    }
  }, [error]);

  return {
    isLoading: isLoading || isWaiting,
    isLocking: isWaiting,
    lockTrxReceipt,
    startLockingWithPermit,
  };
}

export function useLockWithApprove() {
  const {
    write: lockWithApprove,
    data: lockResult,
    isLoading,
    error,
  } = useWriteLock();
  const { data: lockTrxReceipt, isLoading: isWaiting } = useWaitForTransaction({
    hash: lockResult?.hash,
  });
  const {
    checkAllowance,
    isAllowed,
    isLoading: approveIsLoading,
  } = useIncreaseAllowance(WSDM_CONTRACT_ADDRESS, LOCKING_CONTRACT_ADDRESS);

  useEffect(() => {
    if (isAllowed) lockWithApprove();
  }, [isAllowed, lockWithApprove]);

  useEffect(() => {
    if (lockTrxReceipt?.status === 'success') {
      notification.success({
        message: 'Your tokens are locked successfully',
      });
    }
  }, [lockTrxReceipt]);

  useEffect(() => {
    if (error) {
      notification.error({
        message: extractWagmiErrorMessage(error.message),
      });
    }
  }, [error]);

  return {
    isLoading: isLoading || isWaiting || approveIsLoading,
    isLocking: isWaiting,
    lockTrxReceipt,
    startLockingWithApprove: checkAllowance,
  };
}
