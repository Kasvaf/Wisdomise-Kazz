import { useAlerts } from 'api/alert';
import Spinner from 'shared/Spinner';
import { AlertRow } from './AlertRow';

export default function AlertsTab() {
  const alerts = useAlerts('market_data');
  const alertList = alerts.data ?? [];

  return (
    <div>
      {alerts.isLoading ? (
        <div className="flex min-h-96 items-center justify-center">
          <Spinner />
        </div>
      ) : (
        <div className="space-y-4">
          {alertList.map((alertItem, index) => (
            <AlertRow
              key={alertItem.key as string}
              alert={alertItem}
              rank={index + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}
