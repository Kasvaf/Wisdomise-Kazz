import { useAccount, useContractRead, useContractWrite } from 'wagmi';
import { zeroAddress } from 'viem';
import { LOCKING_ABI } from 'modules/account/PageToken/web3/locking/abi';
import { isProduction } from 'utils/version';

export const LOCKING_CONTRACT_ADDRESS = isProduction
  ? zeroAddress
  : '0xF7767abb9E240f66c1a14D18e52a928C69f26e22';

const lockingContractDefaultConfig = {
  address: LOCKING_CONTRACT_ADDRESS,
  abi: LOCKING_ABI,
} as const;

export function useWriteLockWithPermit() {
  return useContractWrite({
    ...lockingContractDefaultConfig,
    functionName: 'lockWithPermit',
  });
}

export function useReadLockedBalance() {
  const { address } = useAccount();
  return useContractRead({
    ...lockingContractDefaultConfig,
    functionName: 'balanceOf',
    args: [address ?? zeroAddress],
    enabled: !!address,
  });
}

export function useReadUnlockedInfo() {
  const { address } = useAccount();
  return useContractRead({
    ...lockingContractDefaultConfig,
    functionName: 'getUserUnLockedInfo',
    args: [address ?? zeroAddress],
    enabled: !!address,
  });
}

export function useWriteUnlock() {
  return useContractWrite({
    ...lockingContractDefaultConfig,
    functionName: 'unlock',
  });
}

export function useWriteWithdraw() {
  return useContractWrite({
    ...lockingContractDefaultConfig,
    functionName: 'withdraw',
  });
}
