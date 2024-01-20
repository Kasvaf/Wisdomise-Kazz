import { useCallback, useEffect } from 'react';
import { useAccount, useWaitForTransaction } from 'wagmi';
import { notification } from 'antd';
import Button from 'shared/Button';
import Card from 'shared/Card';
import {
  MIGRATION_CONTRACT_ADDRESS,
  useMigrateWrite,
} from 'modules/account/PageToken/web3/migrationContract';
import {
  useReadTwsdmAllowance,
  useWriteTwsdmApprove,
  useTwsdmBalance,
} from 'modules/account/PageToken/web3/twsdmContract';
import { ReactComponent as MigrateIcon } from './icons/migrate.svg';

export default function Migration() {
  const { address } = useAccount();
  const { data: tWSDMBalance } = useTwsdmBalance();
  const { data: allowance, refetch: refetchAllowance } =
    useReadTwsdmAllowance();

  const {
    write: migrate,
    data: migrateResult,
    isLoading: migrateIsLoading,
    error: migrationError,
  } = useMigrateWrite();
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
    }
  }, [migrateTrxReceipt]);

  useEffect(() => {
    if (migrationError) {
      notification.error({
        message: migrationError.message,
      });
    }
  }, [migrationError]);

  const isLoading =
    approveIsLoading ||
    approveTrxIsLoading ||
    migrateIsLoading ||
    migrateTrxIsLoading;

  return (
    <Card className="relative">
      <MigrateIcon className="absolute right-0 top-0" />
      <h2 className="mb-2 text-2xl font-medium">Migration</h2>
      <p className="text-white/40">Migrate from tWSDM to WSDM</p>
      <div className="mt-10 flex flex-wrap items-center justify-between gap-4">
        <ul className="ms-4 list-disc text-white/80">
          <li>
            Claim with Confidence: Use the ‘Claim’ button to securely exchange
            your tWSDM for WSDM tokens.
          </li>
          <li>
            Stay Informed: Keep track of your migration status and vesting
            milestones all in one place.
          </li>
        </ul>
        <Button
          variant="secondary"
          onClick={handleMigration}
          loading={isLoading}
          disabled={isLoading}
        >
          Lets Migrate
        </Button>
      </div>
    </Card>
  );
}
