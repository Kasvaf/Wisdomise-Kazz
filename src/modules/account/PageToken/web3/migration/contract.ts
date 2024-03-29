import { useContractWrite } from 'wagmi';
import { zeroAddress } from 'viem';
import { MIGRATION_ABI } from 'modules/account/PageToken/web3/migration/abi';
import { isProduction } from 'utils/version';

export const MIGRATION_CONTRACT_ADDRESS = isProduction
  ? zeroAddress
  : '0x80D5CcBB36DE5A0c19a333E672c2a9352B401fF8';

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
