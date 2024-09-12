import { type ColumnType } from 'antd/es/table';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useCoinOverview } from 'api';
import { type AlertState, type Alert } from 'api/alert';
import { OverviewWidget } from 'shared/OverviewWidget';
import { ReadableNumber } from 'shared/ReadableNumber';
import Table from 'shared/Table';
import { Coin } from 'shared/Coin';
import { ReadableDate } from 'shared/ReadableDate';
import { AlertType } from '../AlertType';
import { AlertTarget } from '../AlertTarget';
import { AlertDeliveryMethods } from '../AlertDeliveryMethods';
import { AlertFrequency } from '../AlertFrequency';
import { AlertStateChanger } from '../AlertStateChanger';
import { AlertActions } from '../AlertActions';

export function SlugAlertGroupWidget({
  alerts,
  slug,
  searchQuery,
  stateQuery,
}: {
  alerts: Array<Alert<never>>;
  slug: string;
  searchQuery?: string;
  stateQuery?: AlertState;
}) {
  const { t } = useTranslation('alerts');
  const coin = useCoinOverview({ slug });

  const columns = useMemo<Array<ColumnType<Alert<never>>>>(
    () => [
      {
        title: t('tables.slug.creation_date'),
        render: (_, row) => <ReadableDate value={row.createdAt} />,
      },
      {
        title: t('tables.slug.type'),
        render: (_, row) => <AlertType value={row} />,
      },
      {
        title: t('tables.slug.target'),
        className: '!max-w-72',
        render: (_, row) => <AlertTarget value={row} />,
      },
      {
        title: t('tables.slug.delivery-methods'),
        render: (_, row) => <AlertDeliveryMethods value={row} />,
      },
      {
        title: t('tables.slug.frequency'),
        render: (_, row) => <AlertFrequency value={row} />,
      },
      {
        title: t('tables.slug.actions'),
        render: (_, row) => <AlertActions value={row} />,
      },
      {
        title: t('tables.slug.status'),
        render: (_, row) => <AlertStateChanger value={row} />,
      },
    ],
    [t],
  );

  const alertsMatchedStateQuery = alerts.filter(row =>
    stateQuery
      ? row.state === stateQuery ||
        (row.state === 'SNOOZE' && stateQuery === 'ACTIVE')
      : true,
  );

  const isCoinMatchedSearchQuery = searchQuery
    ? coin.data &&
      JSON.stringify(coin.data.symbol)
        .toLowerCase()
        .includes(searchQuery?.toLowerCase())
    : true;

  if (alertsMatchedStateQuery.length === 0 || !isCoinMatchedSearchQuery)
    return null;

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
        dataSource={alerts.filter(row =>
          stateQuery
            ? row.state === stateQuery ||
              (row.state === 'SNOOZE' && stateQuery === 'ACTIVE')
            : true,
        )}
        rowKey={row => row.key ?? ''}
        pagination={false}
        rowClassName="[&_td]:!py-6"
      />
    </OverviewWidget>
  );
}
