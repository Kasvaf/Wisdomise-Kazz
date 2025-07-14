import { useTranslation } from 'react-i18next';
import { useMemo, useState } from 'react';

import { clsx } from 'clsx';
import { useCoinDetails, useNCoinDetails, type Pool } from 'api/discovery';
import { Table, type TableColumn } from 'shared/v1-components/Table';
import { ReadableNumber } from 'shared/ReadableNumber';
import { ReadableDate } from 'shared/ReadableDate';
import { NCoinBuySell } from 'modules/discovery/ListView/NetworkRadar/NCoinBuySell';
import { Button } from 'shared/v1-components/Button';
import { ContractAddress } from 'shared/ContractAddress';

export function CoinPoolsWidget({
  slug,
  id,
  title,
  limit: _limit = 6,
  hr,
  className,
}: {
  slug: string;
  id?: string;
  title?: boolean;
  limit?: number;
  hr?: boolean;
  className?: string;
}) {
  const { t } = useTranslation('coin-radar');
  const coin = useCoinDetails({ slug });
  const nCoin = useNCoinDetails({ slug });
  const pools = nCoin.data?.pools ?? coin.data?.symbol_pools ?? [];
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
          <ReadableDate value={row.pool_created_at} className="text-xs" />
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
            value={{
              buys: row.h24_buys,
              sells: row.h24_sells,
            }}
            className="text-xs"
          />
        ),
      },
      {
        title: t('pools.table.volume'),
        render: row => (
          <ReadableNumber
            value={row.h24_volume_usd_liquidity}
            label="$"
            className="text-xs"
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
        id={id}
        className={clsx(
          'relative flex flex-col gap-4 overflow-auto overflow-x-hidden',
          className,
        )}
      >
        {title !== false && (
          <h3 className="text-sm font-semibold">
            {t('coin-details.tabs.pools.title')}
          </h3>
        )}
        <Table
          columns={columns}
          dataSource={pools?.slice(0, limit)}
          rowKey={row => `${row.address ?? ''}${row.name ?? ''}`}
          surface={2}
          scrollable
          footer={
            typeof _limit === 'number' &&
            (pools?.length ?? 0) > _limit && (
              <Button
                size="xs"
                onClick={() => setLimit(undefined)}
                variant="link"
              >
                {t('common:load-more')}
              </Button>
            )
          }
        />
      </div>
      {hr && <hr className="border-white/10" />}
    </>
  );
}
