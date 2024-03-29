import { useContractRead, useContractWrite } from 'wagmi';
import { zeroAddress } from 'viem';
import { isProduction } from 'utils/version';
import { AIRDROP_ABI } from 'modules/account/PageToken/web3/airdrop/abi';

export const AIRDROP_CONTRACT_ADDRESS = isProduction
  ? zeroAddress
  : '0xc2431fd5aa88c9ECF6Fb1a3b3c77E58F58E9245E';

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
