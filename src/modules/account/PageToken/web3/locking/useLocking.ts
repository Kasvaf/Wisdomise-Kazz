import { useAccount, useWaitForTransaction } from 'wagmi';
import { useEffect, useState } from 'react';
import { notification } from 'antd';
import { hexToNumber, toHex } from 'viem';
import { secp256k1 } from '@noble/curves/secp256k1';
import { useWSDMPermitSignature } from 'modules/account/PageToken/web3/wsdm/contract';
import {
  useReadLockedBalance,
  useReadUnlockedInfo,
  useWriteLockWithPermit,
} from 'modules/account/PageToken/web3/locking/contract';
import { addComma } from 'utils/numbers';
import { type UtilityStatus } from 'modules/account/PageToken/Utility';
import { useSubscription } from 'api';

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

  useEffect(() => {
    if (lockTrxReceipt?.status === 'success') {
      notification.success({
        message: 'Your tokens locked successfully',
      });
    }
  }, [lockTrxReceipt]);

  useEffect(() => {
    if (error) {
      notification.error({
        message: error.message,
      });
    }
  }, [error]);

  return {
    isLoading: isLoading || isWaiting,
    isLocking: isWaiting,
    lockTrxReceipt,
    lockWithPermit,
  };
}

export function useLocking() {
  const [amount, setAmount] = useState<bigint>();
  const [deadline, setDeadline] = useState(0);
  const { data: lockedBalance, refetch: refetchLockedInfo } =
    useReadLockedBalance();
  const { data: unlockedInfo, refetch: refetchUnlockedInfo } =
    useReadUnlockedInfo();
  const { sign, signature, isLoading: isSigning } = useWSDMPermitSignature();
  const { address } = useAccount();
  const [utilityStatus, setUtilityStatus] = useState<UtilityStatus>();
  const { lockWithPermit, lockTrxReceipt, isLoading, isLocking } =
    useLockWithPermit();
  const { isFreePlan } = useSubscription();

  useEffect(() => {
    if (lockedBalance !== undefined && unlockedInfo !== undefined) {
      if (unlockedInfo.unlockAmount) {
        if (Date.now() > unlockedInfo.withdrawTimestamp * 1000n) {
          setUtilityStatus('pending_withdraw');
        } else {
          setUtilityStatus('pending_unlock');
        }
      } else {
        if (lockedBalance === 0n) {
          if (isFreePlan) {
            setUtilityStatus('pending_lock');
          } else {
            setUtilityStatus('already_active');
          }
        } else {
          setUtilityStatus('locked');
        }
      }
    }
  }, [isFreePlan, lockedBalance, unlockedInfo]);

  const handleLocking = async (amount: number) => {
    const d = await sign(amount * 10 ** 6);
    setDeadline(d);
    setAmount(BigInt(amount * 10 ** 6));
  };

  useEffect(() => {
    if (signature && amount) {
      const { r, s } = secp256k1.Signature.fromCompact(signature.slice(2, 130));
      const v = hexToNumber(`0x${signature.slice(130)}`);
      lockWithPermit({
        args: [amount, amount, BigInt(deadline), v, toHex(r), toHex(s)],
      });
    }
  }, [address, amount, deadline, lockWithPermit, signature]);

  return {
    handleLocking,
    isLoading: isLoading || isSigning,
    isLocking,
    lockTrxReceipt,
    refetchUnlockedInfo,
    refetchLockedInfo,
    lockedBalance: addComma(Number(lockedBalance ?? 0n) / 10 ** 6),
    unlockedBalance: addComma(
      Number(unlockedInfo?.unlockAmount ?? 0n) / 10 ** 6,
    ),
    withdrawTimestamp: Number(unlockedInfo?.withdrawTimestamp ?? 0),
    utilityStatus,
  };
}
