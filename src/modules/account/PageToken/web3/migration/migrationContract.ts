import { useContractWrite } from 'wagmi';
import { MIGRATION_ABI } from 'modules/account/PageToken/web3/migration/migrationAbi';

export const MIGRATION_CONTRACT_ADDRESS =
  '0xD50AABd5498142eE17535c06d6ED4d68a711040F';

const migrationContractDefaultConfig = {
  address: MIGRATION_CONTRACT_ADDRESS,
  abi: MIGRATION_ABI,
} as const;

export function useWriteMigrate() {
  return useContractWrite({
    ...migrationContractDefaultConfig,
    functionName: 'migrate',
  });
}
