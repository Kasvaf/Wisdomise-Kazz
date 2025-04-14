import { useTranslation } from 'react-i18next';
import { useMemo } from 'react';
import { type ColumnType } from 'antd/es/table';
import { clsx } from 'clsx';
import { useCoinPools } from 'api';
import Table from 'shared/Table';
import { ReadableNumber } from 'shared/ReadableNumber';
import { type Pool } from 'api/types/shared';
import { shortenAddress } from 'utils/shortenAddress';
import { ReadableDate } from 'shared/ReadableDate';
import { NCoinBuySell } from 'modules/insight/PageNetworkRadar/components/NCoinBuySell';

export function CoinPoolsWidget({
  slug,
  id,
  hr,
  className,
}: {
  slug: string;
  id?: string;
  hr?: boolean;
  className?: string;
}) {
  const { t } = useTranslation('coin-radar');
  const pools = useCoinPools({ slug, network: 'solana' });

  const columns = useMemo<Array<ColumnType<Pool>>>(
    () => [
      {
        title: t('pools.table.address'),
        render: (_, row) => (
          <p className="text-xs">{shortenAddress(row.address ?? '')}</p>
        ),
        width: '10%',
      },
      {
        title: t('pools.table.name'),
        render: (_, row) => <p className="text-xs">{row.name ?? '---'}</p>,
        width: '20%',
      },
      {
        title: t('pools.table.created_at'),
        sorter: (a, b) =>
          new Date(a.pool_created_at ?? 0).getTime() -
          new Date(b.pool_created_at ?? 0).getTime(),
        render: (_, row) => (
          <ReadableDate value={row.pool_created_at} className="text-xs" />
        ),
        width: '10%',
      },
      {
        title: t('pools.table.dex'),
        render: (_, row) => (
          <p className="text-xs capitalize">
            {row.dex?.replaceAll('-', ' ') ?? '---'}
          </p>
        ),
        width: '20%',
      },
      {
        title: t('pools.table.txns'),
        render: (_, row) => (
          <NCoinBuySell
            value={{
              buys: row.h24_buys,
              sells: row.h24_sells,
            }}
            className="text-xs"
          />
        ),
        width: '20%',
      },
      {
        title: t('pools.table.volume'),
        render: (_, row) => (
          <ReadableNumber
            value={row.h24_volume_usd_liquidity}
            label="$"
            className="text-xs"
          />
        ),
        width: '20%',
      },
    ],
    [t],
  );

  if ((pools.data ?? []).length === 0) return null;

  return (
    <>
      <div
        id={id}
        className={clsx(
          'relative flex flex-col gap-4 overflow-auto overflow-x-hidden',
          className,
        )}
      >
        <h3 className="text-sm font-semibold">
          {t('coin-details.tabs.pools.title')}
        </h3>
        <Table
          loading={pools.isLoading}
          columns={columns}
          dataSource={pools.data ?? []}
          rowKey={row => `${row.address ?? ''}${row.name ?? ''}`}
          tableLayout="auto"
          pagination={{
            pageSize: 5,
            hideOnSinglePage: true,
          }}
          surface={1}
        />
      </div>
      {hr && <hr className="border-white/10" />}
    </>
  );
}
