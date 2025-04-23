import { Tooltip } from 'antd';
import { useTranslation } from 'react-i18next';
import Button from 'shared/Button';
import Card from 'shared/Card';
import { useMigration } from 'modules/account/PageToken/web3/migration/useMigration';
import { ReactComponent as MigrateIcon } from './icons/migrate.svg';
import { ReactComponent as InfoIcon } from './icons/info.svg';

export default function Migration() {
  const { t } = useTranslation('wisdomise-token');
  const { handleMigration, isLoading } = useMigration();

  return (
    <Card className="relative mt-4 flex items-center justify-between !bg-v1-surface-l2 max-md:flex-wrap">
      <MigrateIcon className="absolute right-0 top-0" />
      <h2 className="flex items-center gap-2 text-2xl font-medium">
        {t('migration.title')}
        <Tooltip title={t('migration.description')}>
          <InfoIcon className="mb-4" />
        </Tooltip>
      </h2>
      <Button
        className="relative max-md:mt-6 max-md:w-full md:me-28"
        variant="secondary"
        onClick={handleMigration}
        loading={isLoading}
        disabled={isLoading}
      >
        {t('migration.migrate')}
      </Button>
    </Card>
  );
}
