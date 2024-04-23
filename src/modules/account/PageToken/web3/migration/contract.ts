import { useContractWrite } from 'wagmi';
import { zeroAddress } from 'viem';
import { MIGRATION_ABI } from 'modules/account/PageToken/web3/migration/abi';
import { isProduction } from 'utils/version';

export const MIGRATION_CONTRACT_ADDRESS = isProduction
  ? zeroAddress
  : '0x33E5b1D5f78a0Fed4B436bbE4580579f0EA399d0';

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
