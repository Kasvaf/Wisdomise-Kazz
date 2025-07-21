import { useWriteLock } from 'modules/account/PageToken/web3/locking/contract';
import {
  LOCKING_CONTRACT_ADDRESS,
  WSDM_CONTRACT_ADDRESS,
} from '../../constants';
import { useEnsureAllowance } from '../shared';

export function useLockWithApprove() {
  const {
    writeAndWait: lock,
    isPending: lockingIsPending,
    isWaiting: lockingIsWaiting,
  } = useWriteLock();

  const {
    ensureAllowance,
    isPending: approveIsPending,
    isWaiting: approveIsWaiting,
  } = useEnsureAllowance(WSDM_CONTRACT_ADDRESS, LOCKING_CONTRACT_ADDRESS);

  const lockWithApprove = async (amount: bigint) => {
    const isAllowed = await ensureAllowance(amount);
    if (isAllowed) {
      return await lock(amount);
    }
  };

  return {
    approveIsPending,
    approveIsWaiting,
    lockingIsPending,
    lockingIsWaiting,
    lockWithApprove,
  };
}
