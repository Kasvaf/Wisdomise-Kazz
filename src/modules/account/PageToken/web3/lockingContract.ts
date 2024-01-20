import { useContractRead } from 'wagmi';
import { LOCKING_ABI } from 'modules/account/PageToken/web3/lockingAbi';

export const LOCKING_CONTRACT_ADDRESS = '0x0';

const LOCKING_CONTRACT_DEFAULT_CONFIG = {
  address: LOCKING_CONTRACT_ADDRESS,
  abi: LOCKING_ABI,
} as const;

export function useGetLockedUsersByAddress(address: `0x${string}`) {
  return useContractRead({
    ...LOCKING_CONTRACT_DEFAULT_CONFIG,
    functionName: 'getLockedUsers',
    args: [address],
  });
}
