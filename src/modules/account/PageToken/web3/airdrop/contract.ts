import { useContractRead, useContractWrite } from 'wagmi';
import { AIRDROP_ABI } from 'modules/account/PageToken/web3/airdrop/abi';
import { MERKLE_DISTRIBUTOR_CONTRACT_ADDRESS } from 'modules/account/PageToken/constants';

const airdropContractDefaultConfig = {
  address: MERKLE_DISTRIBUTOR_CONTRACT_ADDRESS,
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
