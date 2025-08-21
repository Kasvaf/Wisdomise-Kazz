import { useMigration } from 'modules/account/PageToken/web3/migration/useMigration';
import { useTWSDMBalance } from 'modules/account/PageToken/web3/twsdm/contract';
import { useTranslation } from 'react-i18next';
import { Button } from 'shared/v1-components/Button';

export default function Migration() {
  const { t } = useTranslation('wisdomise-token');
  const { data: tWSDMBalance } = useTWSDMBalance();

  const {
    migrate,
    approveIsPending,
    approveIsWaiting,
    migrationIsPending,
    migrationIsWaiting,
  } = useMigration();

  return (tWSDMBalance?.value ?? 0n) > 0n ? (
    <div className="!bg-v1-surface-l2 relative mt-4 rounded-xl p-6 max-md:flex-wrap">
      <h2 className="mb-3 font-semibold text-2xl">{t('migration.title')}</h2>
      <p className="mb-6 text-sm text-v1-content-secondary">
        {t('migration.description')}
      </p>
      <Button
        className="relative max-md:mt-6 max-md:w-full md:me-28"
        disabled={!tWSDMBalance?.value}
        loading={
          approveIsPending ||
          approveIsWaiting ||
          migrationIsPending ||
          migrationIsWaiting
        }
        onClick={migrate}
      >
        {approveIsPending
          ? 'Waiting for approval signature...'
          : approveIsWaiting
            ? 'Approval transaction is confirming...'
            : migrationIsPending
              ? 'Waiting for migration signature...'
              : migrationIsWaiting
                ? 'Migration transaction is confirming...'
                : t('migration.migrate')}
      </Button>
    </div>
  ) : null;
}
