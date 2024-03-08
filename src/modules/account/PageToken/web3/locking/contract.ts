import { useAccount, useContractRead, useContractWrite } from 'wagmi';
import { zeroAddress } from 'viem';
import { LOCKING_ABI } from 'modules/account/PageToken/web3/locking/abi';
import { isProduction } from 'utils/version';

export const LOCKING_CONTRACT_ADDRESS = isProduction
  ? zeroAddress
  : '0x4792B74D02a60F6019288663eD7f01cB0632dfA2';

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
