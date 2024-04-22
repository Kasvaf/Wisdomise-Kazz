import { useContractWrite } from 'wagmi';
import { zeroAddress } from 'viem';
import { MIGRATION_ABI } from 'modules/account/PageToken/web3/migration/abi';
import { isProduction } from 'utils/version';

export const MIGRATION_CONTRACT_ADDRESS = isProduction
  ? zeroAddress
  : '0xDd581Ec3F2a527660f951b567364907cBFBe928c';

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
