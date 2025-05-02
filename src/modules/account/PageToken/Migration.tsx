import { useTranslation } from 'react-i18next';
import { useMigration } from 'modules/account/PageToken/web3/migration/useMigration';
import { Button } from 'shared/v1-components/Button';
import { useTWSDMBalance } from 'modules/account/PageToken/web3/twsdm/contract';

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
    <div className="relative mt-4 rounded-xl !bg-v1-surface-l2 p-6 max-md:flex-wrap">
      <h2 className="mb-3 text-2xl font-semibold">{t('migration.title')}</h2>
      <p className="mb-6 text-sm text-v1-content-secondary">
        {t('migration.description')}
      </p>
      <Button
        className="relative max-md:mt-6 max-md:w-full md:me-28"
        onClick={migrate}
        disabled={!tWSDMBalance?.value}
        loading={
          approveIsPending ||
          approveIsWaiting ||
          migrationIsPending ||
          migrationIsWaiting
        }
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
