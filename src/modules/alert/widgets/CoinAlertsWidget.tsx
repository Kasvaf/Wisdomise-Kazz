import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useCoinDetails } from 'api';
import { type Alert } from 'api';
import { OverviewWidget } from 'shared/OverviewWidget';
import { ReadableNumber } from 'shared/ReadableNumber';
import { Table, type TableColumn } from 'shared/v1-components/Table';
import { Coin } from 'shared/Coin';
import { ReadableDate } from 'shared/ReadableDate';
import { AlertType } from 'modules/alert/components/AlertType';
import { AlertDeliveryMethods } from 'modules/alert/components/AlertDeliveryMethods';
import { AlertFrequency } from 'modules/alert/components/AlertFrequency';
import { AlertStateChanger } from 'modules/alert/components/AlertStateChanger';
import { AlertActions } from 'modules/alert/components/AlertActions';
import { AlertTarget } from 'modules/alert/components/AlertTarget';

export function CoinAlertsWidget({ alerts }: { alerts: Alert[] }) {
  const { t } = useTranslation('alerts');
  const slug = alerts[0].params.find(x => x.field_name === 'base')?.value;
  if (!slug) throw new Error('coin alerts not works');
  const coin = useCoinDetails({ slug });

  const columns = useMemo<Array<TableColumn<Alert>>>(
    () => [
      {
        title: t('tables.creation-date'),
        width: 80,
        render: row => (
          <ReadableDate value={row.created_at} className="whitespace-nowrap" />
        ),
      },
      {
        title: t('tables.type'),
        width: 250,
        render: row => <AlertType value={row} className="whitespace-nowrap" />,
      },
      {
        title: t('tables.target'),
        width: 320,
        render: row => <AlertTarget value={row} />,
      },
      {
        title: t('tables.delivery-methods'),
        render: row => <AlertDeliveryMethods value={row} />,
      },
      {
        title: t('tables.frequency'),
        render: row => (
          <AlertFrequency value={row} className="whitespace-nowrap" />
        ),
      },
      {
        title: t('tables.actions'),
        render: row => <AlertActions value={row} />,
      },
      {
        title: t('tables.status'),
        render: row => <AlertStateChanger value={row} />,
      },
    ],
    [t],
  );

  if (alerts.length === 0) return null;

  return (
    <OverviewWidget>
      <div className="mb-2 flex min-h-[37px] flex-row items-center justify-start gap-4">
        {coin.data && (
          <>
            {coin.data?.symbol && (
              <div className="min-w-36">
                <Coin
                  coin={coin.data?.symbol}
                  className="text-xs"
                  imageClassName="size-7"
                />
              </div>
            )}
            <div className="inline-flex items-center gap-1 text-xs">
              <span className="text-v1-content-secondary">
                {t('common.current-price')}:
              </span>
              <ReadableNumber
                value={coin.data?.data?.current_price}
                label="usdt"
              />
            </div>
          </>
        )}
      </div>
      <Table
        columns={columns}
        dataSource={alerts}
        scrollable
        rowKey={row => row.key ?? row.data_source}
      />
    </OverviewWidget>
  );
}
