import { useContractRead, useContractWrite } from 'wagmi';
import { zeroAddress } from 'viem';
import { isProduction } from 'utils/version';
import { AIRDROP_ABI } from 'modules/account/PageToken/web3/airdrop/abi';

export const AIRDROP_CONTRACT_ADDRESS = isProduction
  ? zeroAddress
  : '0x824e15d8B53aAc9b7Cc1060A46eEd1C6D29AACB1';

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
