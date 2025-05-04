import { useAccount, useReadContract, useWriteContract } from 'wagmi';
import { zeroAddress } from 'viem';
import { LOCKING_ABI } from 'modules/account/PageToken/web3/locking/abi';
import { LOCKING_CONTRACT_ADDRESS } from 'modules/account/PageToken/constants';
import { useWaitResolver } from 'modules/account/PageToken/web3/shared';
import { useAccountQuery } from 'api';

const lockingContractDefaultConfig = {
  address: LOCKING_CONTRACT_ADDRESS,
  abi: LOCKING_ABI,
} as const;

export function useReadLockedBalance() {
  const { data } = useAccountQuery();
  return useReadContract({
    ...lockingContractDefaultConfig,
    functionName: 'balanceOf',
    args: [data?.wallet_address ?? zeroAddress],
  });
}

export function useReadLockedUsers() {
  const { address } = useAccount();
  return useReadContract({
    ...lockingContractDefaultConfig,
    functionName: 'getLockedUsers',
    args: [address ?? zeroAddress],
    query: {
      enabled: !!address,
    },
  });
}

export function useReadUnlockedInfo() {
  const { data } = useAccountQuery();
  return useReadContract({
    ...lockingContractDefaultConfig,
    functionName: 'getUserUnLockedInfo',
    args: [data?.wallet_address ?? zeroAddress],
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
