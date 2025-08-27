import { type Pool, useCoinDetails } from 'api/discovery';
import { clsx } from 'clsx';
import { NCoinBuySell } from 'modules/discovery/ListView/NetworkRadar/NCoinBuySell';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ContractAddress } from 'shared/ContractAddress';
import { ReadableDate } from 'shared/ReadableDate';
import { ReadableNumber } from 'shared/ReadableNumber';
import { Button } from 'shared/v1-components/Button';
import { Table, type TableColumn } from 'shared/v1-components/Table';
import { useUnifiedCoinDetails } from './lib';

export function CoinPoolsWidget({
  id,
  title,
  limit: _limit = 6,
  hr,
  className,
}: {
  id?: string;
  title?: boolean;
  limit?: number;
  hr?: boolean;
  className?: string;
}) {
  const { t } = useTranslation('coin-radar');
  const { symbol } = useUnifiedCoinDetails();
  const nCoinDetails = useCoinDetails({ slug: symbol.slug });
  const pools = nCoinDetails.data?.symbol_pools ?? [];
  const [limit, setLimit] = useState<number | undefined>(_limit);

  const columns = useMemo<Array<TableColumn<Pool>>>(
    () => [
      {
        title: t('pools.table.address'),
        render: row => row.address && <ContractAddress value={row.address} />,
        sticky: 'start',
      },
      {
        title: t('pools.table.name'),
        render: row => <p className="text-xs">{row.name ?? '---'}</p>,
      },
      {
        title: t('pools.table.created_at'),
        sorter: (a, b) =>
          new Date(a.pool_created_at ?? 0).getTime() -
          new Date(b.pool_created_at ?? 0).getTime(),
        render: row => (
          <ReadableDate className="text-xs" value={row.pool_created_at} />
        ),
      },
      {
        title: t('pools.table.dex'),
        render: row => (
          <p className="text-xs capitalize">
            {row.dex?.replaceAll('-', ' ') ?? '---'}
          </p>
        ),
      },
      {
        title: t('pools.table.txns'),
        render: row => (
          <NCoinBuySell
            className="text-xs"
            value={{
              buys: row.h24_buys,
              sells: row.h24_sells,
            }}
          />
        ),
      },
      {
        title: t('pools.table.volume'),
        render: row => (
          <ReadableNumber
            className="text-xs"
            label="$"
            value={row.h24_volume_usd_liquidity}
          />
        ),
      },
    ],
    [t],
  );

  if (pools.length === 0) return null;

  return (
    <>
      <div
        className={clsx(
          'relative flex flex-col gap-4 overflow-auto overflow-x-hidden',
          className,
        )}
        id={id}
      >
        {title !== false && (
          <h3 className="font-semibold text-sm">
            {t('coin-details.tabs.pools.title')}
          </h3>
        )}
        <Table
          columns={columns}
          dataSource={pools?.slice(0, limit)}
          footer={
            typeof _limit === 'number' &&
            (pools?.length ?? 0) > _limit && (
              <Button
                onClick={() => setLimit(undefined)}
                size="xs"
                variant="link"
              >
                {t('common:load-more')}
              </Button>
            )
          }
          rowKey={row => `${row.address ?? ''}${row.name ?? ''}`}
          scrollable
          surface={1}
        />
      </div>
      {hr && <hr className="border-white/10" />}
    </>
  );
}
