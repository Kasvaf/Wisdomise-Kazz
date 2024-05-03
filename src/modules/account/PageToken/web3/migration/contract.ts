import { useContractWrite } from 'wagmi';
import { MIGRATION_ABI } from 'modules/account/PageToken/web3/migration/abi';
import { TOKEN_MIGRATION_CONTRACT_ADDRESS } from 'modules/account/PageToken/constants';

const migrationContractDefaultConfig = {
  address: TOKEN_MIGRATION_CONTRACT_ADDRESS,
  abi: MIGRATION_ABI,
} as const;

export function useWriteMigrate() {
  return useContractWrite({
    ...migrationContractDefaultConfig,
    functionName: 'migrate',
  });
}
