import { useWaitForTransaction } from 'wagmi';
import { notification } from 'antd';
import { useEffect } from 'react';
import { useTwsdmBalance } from 'modules/account/PageToken/web3/twsdm/contract';
import { useWriteMigrate } from 'modules/account/PageToken/web3/migration/contract';
import { useVesting } from 'modules/account/PageToken/web3/tokenDistributer/useVesting';
import { extractWagmiErrorMessage } from 'utils/error';
import {
  TOKEN_MIGRATION_CONTRACT_ADDRESS,
  TWSDM_CONTRACT_ADDRESS,
} from 'modules/account/PageToken/constants';
import { useIncreaseAllowance } from '../shared';

export function useMigration() {
  const { refetchAll } = useVesting();
  const { refetch: refetchTwsdmBalance } = useTwsdmBalance();
  const { checkAllowance, isAllowed, isLoading } = useIncreaseAllowance(
    TWSDM_CONTRACT_ADDRESS,
    TOKEN_MIGRATION_CONTRACT_ADDRESS,
  );

  const {
    write: migrate,
    data: migrateResult,
    isLoading: migrateIsLoading,
    error: migrationError,
  } = useWriteMigrate();
  const { data: migrateTrxReceipt, isLoading: migrateTrxIsLoading } =
    useWaitForTransaction({ hash: migrateResult?.hash });

  const handleMigration = () => {
    checkAllowance();
  };

  useEffect(() => {
    if (isAllowed) migrate();
  }, [isAllowed, migrate]);

  useEffect(() => {
    if (migrateTrxReceipt?.status === 'success') {
      notification.success({
        message: 'Migration process started successfully',
      });
      refetchAll();
      void refetchTwsdmBalance();
    }
  }, [migrateTrxReceipt, refetchAll, refetchTwsdmBalance]);

  useEffect(() => {
    if (migrationError) {
      notification.error({
        message: extractWagmiErrorMessage(migrationError.message),
      });
    }
  }, [migrationError]);

  return {
    handleMigration,
    isLoading: isLoading || migrateIsLoading || migrateTrxIsLoading,
  };
}
