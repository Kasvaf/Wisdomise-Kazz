import {
  erc20ABI,
  useAccount,
  useBalance,
  useContractRead,
  useContractWrite,
} from 'wagmi';
import { zeroAddress } from 'viem';
import { isProduction } from 'utils/version';

export const TWSDM_CONTRACT_ADDRESS = isProduction
  ? zeroAddress
  : '0x0DB3430FF725D9d957749732144Ec791704A058f';

const twsdmContractDefaultConfig = {
  address: TWSDM_CONTRACT_ADDRESS,
  abi: erc20ABI,
} as const;

export function useReadTwsdmAllowance(contractAddress: `0x${string}`) {
  const { address } = useAccount();
  return useContractRead({
    ...twsdmContractDefaultConfig,
    functionName: 'allowance',
    args: [address ?? zeroAddress, contractAddress],
    enabled: !!address,
  });
}

export function useWriteTwsdmApprove() {
  return useContractWrite({
    ...twsdmContractDefaultConfig,
    functionName: 'approve',
  });
}

export function useTwsdmBalance() {
  const { address } = useAccount();
  return useBalance({
    address,
    token: TWSDM_CONTRACT_ADDRESS,
    enabled: !!address,
  });
}
