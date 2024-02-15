import { useContractRead } from 'wagmi';
import { VESTING_ABI } from 'modules/account/PageToken/web3/vesting/vestingAbi';

export const VESTING_CONTRACT_ADDRESS = '0x0';

const VESTING_CONTRACT_DEFAULT_CONFIG = {
  address: VESTING_CONTRACT_ADDRESS,
  abi: VESTING_ABI,
} as const;

export function useCurrentRoundNumberRead() {
  return useContractRead({
    ...VESTING_CONTRACT_DEFAULT_CONFIG,
    functionName: '_getVestingRound',
  });
}
