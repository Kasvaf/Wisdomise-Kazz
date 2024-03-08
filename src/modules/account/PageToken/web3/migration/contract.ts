import { useContractWrite } from 'wagmi';
import { zeroAddress } from 'viem';
import { MIGRATION_ABI } from 'modules/account/PageToken/web3/migration/abi';
import { isProduction } from 'utils/version';

export const MIGRATION_CONTRACT_ADDRESS = isProduction
  ? zeroAddress
  : '0x30477b4cf04FbA388B56EB0907f120c1e020b264';

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
