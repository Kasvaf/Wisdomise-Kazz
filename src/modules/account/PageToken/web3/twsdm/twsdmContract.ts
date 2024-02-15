import {
  useAccount,
  useBalance,
  useContractRead,
  useContractWrite,
} from 'wagmi';
import { zeroAddress } from 'viem';
import { MIGRATION_CONTRACT_ADDRESS } from 'modules/account/PageToken/web3/migration/migrationContract';
import { isProduction } from 'utils/version';
import { TWSDM_ABI } from 'modules/account/PageToken/web3/twsdm/twsdmAbi';

export const TWSDM_CONTRACT_ADDRESS = isProduction
  ? zeroAddress
  : '0x7880C04C5EECE6cfE1Ef40490C5595b7e35Be864';

const twsdmContractDefaultConfig = {
  address: TWSDM_CONTRACT_ADDRESS,
  abi: TWSDM_ABI,
} as const;

export function useReadTwsdmAllowance() {
  const { address } = useAccount();
  return useContractRead({
    ...twsdmContractDefaultConfig,
    functionName: 'allowance',
    args: [address ?? zeroAddress, MIGRATION_CONTRACT_ADDRESS],
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
