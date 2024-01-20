import { useContractRead, useContractWrite } from 'wagmi';
import { zeroAddress } from 'viem';
import { MIGRATION_ABI } from 'modules/account/PageToken/web3/migrationAbi';

export const MIGRATION_CONTRACT_ADDRESS =
  '0xD50AABd5498142eE17535c06d6ED4d68a711040F';

const migrationContractDefaultConfig = {
  address: MIGRATION_CONTRACT_ADDRESS,
  abi: MIGRATION_ABI,
} as const;

export function useMigrateWrite() {
  return useContractWrite({
    ...migrationContractDefaultConfig,
    functionName: 'migrate',
  });
}

export function useReadAngelInvestorBalance(address?: `0x${string}`) {
  return useContractRead({
    ...migrationContractDefaultConfig,
    functionName: 'getAngelInvestorBalance',
    args: [address ?? zeroAddress],
  });
}
