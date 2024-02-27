import { useContractWrite } from 'wagmi';
import { zeroAddress } from 'viem';
import { LOCKING_ABI } from 'modules/account/PageToken/web3/locking/abi';
import { isProduction } from 'utils/version';

export const LOCKING_CONTRACT_ADDRESS = isProduction
  ? zeroAddress
  : '0x491b8293bffd71f9f649444f509301a8928d64b0';

const LOCKING_CONTRACT_DEFAULT_CONFIG = {
  address: LOCKING_CONTRACT_ADDRESS,
  abi: LOCKING_ABI,
} as const;

export function useWriteLock() {
  return useContractWrite({
    ...LOCKING_CONTRACT_DEFAULT_CONFIG,
    functionName: 'lock',
  });
}
