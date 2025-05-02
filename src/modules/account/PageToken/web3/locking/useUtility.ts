import { useEffect, useState } from 'react';
import {
  useReadLockedBalance,
  useReadUnlockedInfo,
} from 'modules/account/PageToken/web3/locking/contract';
import { addComma } from 'utils/numbers';
import { type UtilityStatus } from 'modules/account/PageToken/Utility';
import { useSubscription } from 'api';

export function useUtility() {
  const subscription = useSubscription();
  const { data: lockedBalance, refetch: refetchLockedInfo } =
    useReadLockedBalance();
  const { data: unlockedInfo, refetch: refetchUnlockedInfo } =
    useReadUnlockedInfo();
  const [utilityStatus, setUtilityStatus] = useState<UtilityStatus>();

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
          if (subscription.group === 'free' || subscription.group === 'guest') {
            setUtilityStatus('pending_lock');
          } else {
            setUtilityStatus('already_active');
          }
        } else {
          setUtilityStatus('locked');
        }
      }
    }
  }, [subscription, lockedBalance, unlockedInfo]);

  return {
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
