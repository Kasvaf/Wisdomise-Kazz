import { useAccount, useContractRead, useContractWrite } from 'wagmi';
import { zeroAddress } from 'viem';
import { TOKEN_DISTRIBUTOR_ABI } from 'modules/account/PageToken/web3/tokenDistributer/abi';
import { isProduction } from 'utils/version';

export const ANGEL_TOKEN_DISTRIBUTOR_CONTRACT_ADDRESS = isProduction
  ? '0x0'
  : '0x9DF63a2fb3c9BF3736001c21F8D5E964676c63C8';

export const STRATEGIC_TOKEN_DISTRIBUTOR_CONTRACT_ADDRESS = isProduction
  ? '0x0'
  : '0xe6b4D0c1D5a1564B737AEDaE109b0f84187D6023';

const angelTokenDistributorDefaultConfig = {
  address: ANGEL_TOKEN_DISTRIBUTOR_CONTRACT_ADDRESS,
  abi: TOKEN_DISTRIBUTOR_ABI,
} as const;

const strategicTokenDistributorDefaultConfig = {
  address: STRATEGIC_TOKEN_DISTRIBUTOR_CONTRACT_ADDRESS,
  abi: TOKEN_DISTRIBUTOR_ABI,
} as const;

export function useReadAngelAccountShares() {
  const { address } = useAccount();
  return useContractRead({
    ...angelTokenDistributorDefaultConfig,
    functionName: 'getAccountShares',
    args: [address ?? zeroAddress],
  });
}

export function useReadAngelReleasable() {
  const { address } = useAccount();
  return useContractRead({
    ...angelTokenDistributorDefaultConfig,
    functionName: 'releasable',
    args: [address ?? zeroAddress],
  });
}

export function useReadStrategicAccountShares() {
  const { address } = useAccount();
  return useContractRead({
    ...strategicTokenDistributorDefaultConfig,
    functionName: 'getAccountShares',
    args: [address ?? zeroAddress],
  });
}

export function useReadStrategicReleasable() {
  const { address } = useAccount();
  return useContractRead({
    ...strategicTokenDistributorDefaultConfig,
    functionName: 'releasable',
    args: [address ?? zeroAddress],
  });
}

export function useWriteAngelRelease() {
  const { address } = useAccount();
  return useContractWrite({
    ...angelTokenDistributorDefaultConfig,
    functionName: 'release',
    args: [address ?? zeroAddress],
  });
}

export function useWriteStrategicRelease() {
  const { address } = useAccount();
  return useContractWrite({
    ...strategicTokenDistributorDefaultConfig,
    functionName: 'release',
    args: [address ?? zeroAddress],
  });
}
