import { Tooltip } from 'antd';
import Button from 'shared/Button';
import Card from 'shared/Card';
import { useMigration } from 'modules/account/PageToken/web3/migration/useMigration';
import { ReactComponent as MigrateIcon } from './icons/migrate.svg';
import { ReactComponent as InfoIcon } from './icons/info.svg';

export default function Migration() {
  const { handleMigration, isLoading } = useMigration();

  return (
    <Card className="relative mt-4 flex items-center justify-between max-md:flex-wrap">
      <MigrateIcon className="absolute right-0 top-0" />
      <h2 className="flex items-center gap-2 text-2xl font-medium">
        tWSDM Migration
        <Tooltip title="You participated to our private Round and own tWSDM Tokens, you MUST migrate to WSDM Tokens (1:1 ratio) here.">
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
        Migrate Now
      </Button>
    </Card>
  );
}
