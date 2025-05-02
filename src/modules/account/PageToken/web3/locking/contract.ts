import { useAccount, useReadContract, useWriteContract } from 'wagmi';
import { zeroAddress } from 'viem';
import { LOCKING_ABI } from 'modules/account/PageToken/web3/locking/abi';
import { LOCKING_CONTRACT_ADDRESS } from 'modules/account/PageToken/constants';
import { useWaitResolver } from 'modules/account/PageToken/web3/shared';

const lockingContractDefaultConfig = {
  address: LOCKING_CONTRACT_ADDRESS,
  abi: LOCKING_ABI,
} as const;

export function useReadLockedBalance() {
  const { address } = useAccount();
  return useReadContract({
    ...lockingContractDefaultConfig,
    functionName: 'balanceOf',
    args: [address ?? zeroAddress],
    query: {
      enabled: !!address,
    },
  });
}

export function useReadUnlockedInfo() {
  const { address } = useAccount();
  return useReadContract({
    ...lockingContractDefaultConfig,
    functionName: 'getUserUnLockedInfo',
    args: [address ?? zeroAddress],
    query: {
      enabled: !!address,
    },
  });
}

export function useWriteUnlock() {
  const mutation = useWriteContract();
  const { resolver, isWaiting } = useWaitResolver(mutation.data);

  const writeAndWait = () => {
    mutation.writeContract({
      ...lockingContractDefaultConfig,
      functionName: 'unlock',
    });
    return resolver();
  };

  return {
    ...mutation,
    writeAndWait,
    isWaiting,
  };
}

export function useWriteWithdraw() {
  const mutation = useWriteContract();
  const { resolver, isWaiting } = useWaitResolver(mutation.data);

  const writeAndWait = () => {
    mutation.writeContract({
      ...lockingContractDefaultConfig,
      functionName: 'withdraw',
    });
    return resolver();
  };

  return {
    ...mutation,
    writeAndWait,
    isWaiting,
  };
}

export function useWriteLock() {
  const mutation = useWriteContract();
  const { resolver, isWaiting } = useWaitResolver(mutation.data);

  const writeAndWait = (amount: bigint) => {
    mutation.writeContract({
      ...lockingContractDefaultConfig,
      functionName: 'lock',
      args: [amount],
    });
    return resolver();
  };

  return {
    ...mutation,
    writeAndWait,
    isWaiting,
  };
}
