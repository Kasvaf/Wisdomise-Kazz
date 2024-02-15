import Button from 'shared/Button';
import Card from 'shared/Card';
import { useMigration } from 'modules/account/PageToken/web3/useMigration';
import { ReactComponent as MigrateIcon } from './icons/migrate.svg';

export default function Migration() {
  const { handleMigration, isLoading } = useMigration();

  return (
    <Card className="relative mt-4">
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
