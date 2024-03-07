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
  : '0x7880C04C5EECE6cfE1Ef40490C5595b7e35Be864';

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
