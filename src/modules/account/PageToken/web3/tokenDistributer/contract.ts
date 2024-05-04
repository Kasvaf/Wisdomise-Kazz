import { useAccount, useContractRead, useContractWrite } from 'wagmi';
import { zeroAddress } from 'viem';
import { TOKEN_DISTRIBUTOR_ABI } from 'modules/account/PageToken/web3/tokenDistributer/abi';
import {
  ANGEL_TOKEN_DISTRIBUTOR_CONTRACT_ADDRESS,
  INSTITUTIONAL_TOKEN_DISTRIBUTOR_CONTRACT_ADDRESS,
  KOL_TOKEN_DISTRIBUTOR_CONTRACT_ADDRESS,
  STRATEGIC_TOKEN_DISTRIBUTOR_CONTRACT_ADDRESS,
} from 'modules/account/PageToken/constants';

export type Bucket = 'angel' | 'strategic' | 'kol' | 'institutional';

const bucketTokenDistributorAddressMap: Record<Bucket, `0x${string}`> = {
  angel: ANGEL_TOKEN_DISTRIBUTOR_CONTRACT_ADDRESS,
  strategic: STRATEGIC_TOKEN_DISTRIBUTOR_CONTRACT_ADDRESS,
  kol: KOL_TOKEN_DISTRIBUTOR_CONTRACT_ADDRESS,
  institutional: INSTITUTIONAL_TOKEN_DISTRIBUTOR_CONTRACT_ADDRESS,
};

export function useReadAccountShares(bucket: Bucket) {
  const { address } = useAccount();
  return useContractRead({
    address: bucketTokenDistributorAddressMap[bucket],
    abi: TOKEN_DISTRIBUTOR_ABI,
    functionName: 'getAccountShares',
    args: [address ?? zeroAddress],
  });
}

export function useReadReleasable(bucket: Bucket) {
  const { address } = useAccount();
  return useContractRead({
    address: bucketTokenDistributorAddressMap[bucket],
    abi: TOKEN_DISTRIBUTOR_ABI,
    functionName: 'releasable',
    args: [address ?? zeroAddress],
  });
}

export function useWriteRelease(bucket: Bucket) {
  const { address } = useAccount();
  return useContractWrite({
    address: bucketTokenDistributorAddressMap[bucket],
    abi: TOKEN_DISTRIBUTOR_ABI,
    functionName: 'release',
    args: [address ?? zeroAddress],
  });
}
