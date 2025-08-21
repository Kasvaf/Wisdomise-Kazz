import { TOKEN_MIGRATION_CONTRACT_ADDRESS } from 'modules/account/PageToken/constants';
import { MIGRATION_ABI } from 'modules/account/PageToken/web3/migration/abi';
import { useWaitResolver } from 'modules/account/PageToken/web3/shared';
import { useWriteContract } from 'wagmi';

const migrationContractDefaultConfig = {
  address: TOKEN_MIGRATION_CONTRACT_ADDRESS,
  abi: MIGRATION_ABI,
} as const;

export function useWriteMigrate() {
  const mutation = useWriteContract();
  const { resolver, isWaiting } = useWaitResolver(mutation.data);

  const writeAndWait = () => {
    mutation.writeContract({
      ...migrationContractDefaultConfig,
      functionName: 'migrate',
    });
    return resolver();
  };

  return {
    ...mutation,
    writeAndWait,
    isWaiting,
  };
}
