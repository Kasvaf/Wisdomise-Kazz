import { useContractWrite } from 'wagmi';
import { zeroAddress } from 'viem';
import { MIGRATION_ABI } from 'modules/account/PageToken/web3/migration/abi';
import { isProduction } from 'utils/version';

export const MIGRATION_CONTRACT_ADDRESS = isProduction
  ? zeroAddress
  : '0x15050F7903f9eEcD9208B03C58a8C4c09fD77589';

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
