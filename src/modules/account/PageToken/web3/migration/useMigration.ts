import { useAccount, useWaitForTransaction } from 'wagmi';
import { notification } from 'antd';
import { useCallback, useEffect, useMemo } from 'react';
import {
  useReadTwsdmAllowance,
  useTwsdmBalance,
  useWriteTwsdmApprove,
} from 'modules/account/PageToken/web3/twsdm/contract';
import {
  MIGRATION_CONTRACT_ADDRESS,
  useWriteMigrate,
} from 'modules/account/PageToken/web3/migration/contract';
import { useVesting } from 'modules/account/PageToken/web3/tokenDistributer/useVesting';
import { extractWagmiErrorMessage } from 'utils/error';

export function useMigration() {
  const { address } = useAccount();
  const { refetchAll } = useVesting();
  const { data: tWSDMBalance, refetch: refetchTwsdmBalance } =
    useTwsdmBalance();
  const { data: allowance, refetch: refetchAllowance } = useReadTwsdmAllowance(
    MIGRATION_CONTRACT_ADDRESS,
  );

  const {
    write: migrate,
    data: migrateResult,
    isLoading: migrateIsLoading,
    error: migrationError,
  } = useWriteMigrate();
  const { data: migrateTrxReceipt, isLoading: migrateTrxIsLoading } =
    useWaitForTransaction({ hash: migrateResult?.hash });

  const {
    write: approve,
    isLoading: approveIsLoading,
    data: approveResult,
  } = useWriteTwsdmApprove();
  const { data: approveTrxReceipt, isLoading: approveTrxIsLoading } =
    useWaitForTransaction({ hash: approveResult?.hash });

  const handleMigration = () => {
    if (!isAllowed(allowance, tWSDMBalance?.value) && address) {
      approve({
        args: [MIGRATION_CONTRACT_ADDRESS, tWSDMBalance?.value ?? 0n],
      });
    } else {
      migrate();
    }
  };

  const isAllowed = (allowance?: bigint, balance?: bigint) => {
    return (allowance ?? 0n) >= (balance ?? 0n);
  };

  const checkForMigration = useCallback(async () => {
    if (approveTrxReceipt?.status === 'success') {
      const { data: currentAllowance } = await refetchAllowance();
      if (isAllowed(currentAllowance, tWSDMBalance?.value)) {
        migrate();
      } else {
        notification.error({
          message: 'Allowance cap is less than your tWSDM balance.',
        });
      }
    } else if (approveTrxReceipt?.status === 'reverted') {
      notification.error({
        message: 'Approve transaction reverted.',
      });
    }
  }, [
    approveTrxReceipt?.status,
    migrate,
    refetchAllowance,
    tWSDMBalance?.value,
  ]);

  useEffect(() => {
    void checkForMigration();
  }, [
    approveTrxReceipt?.status,
    migrate,
    refetchAllowance,
    tWSDMBalance?.value,
    checkForMigration,
  ]);

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

  const isLoading = useMemo(
    () =>
      approveIsLoading ||
      approveTrxIsLoading ||
      migrateIsLoading ||
      migrateTrxIsLoading,
    [
      approveIsLoading,
      approveTrxIsLoading,
      migrateIsLoading,
      migrateTrxIsLoading,
    ],
  );

  return { handleMigration, isLoading };
}
