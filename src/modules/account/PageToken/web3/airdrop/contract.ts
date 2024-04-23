import { useContractRead, useContractWrite } from 'wagmi';
import { zeroAddress } from 'viem';
import { isProduction } from 'utils/version';
import { AIRDROP_ABI } from 'modules/account/PageToken/web3/airdrop/abi';

// merkle distributor contract
export const AIRDROP_CONTRACT_ADDRESS = isProduction
  ? zeroAddress
  : '0xC66bc3ef01333fCb415c84DF0Ac383212E4D0394';

const airdropContractDefaultConfig = {
  address: AIRDROP_CONTRACT_ADDRESS,
  abi: AIRDROP_ABI,
} as const;

export function useReadAirdropIsClaimed(merkleTreeIndex?: number) {
  return useContractRead({
    ...airdropContractDefaultConfig,
    functionName: 'isClaimed',
    args: [BigInt(merkleTreeIndex ?? 0)],
    enabled: !!merkleTreeIndex,
  });
}

export function useWriteClaimAirdrop() {
  return useContractWrite({
    ...airdropContractDefaultConfig,
    functionName: 'claim',
  });
}
