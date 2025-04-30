import { useTranslation } from 'react-i18next';
import { useMemo, useState } from 'react';

import { clsx } from 'clsx';
import { bxsCopy } from 'boxicons-quasar';
import { useCoinPools } from 'api';
import { Table, type TableColumn } from 'shared/v1-components/Table';
import { ReadableNumber } from 'shared/ReadableNumber';
import { type Pool } from 'api/types/shared';
import { shortenAddress } from 'utils/shortenAddress';
import { ReadableDate } from 'shared/ReadableDate';
import { NCoinBuySell } from 'modules/insight/PageNetworkRadar/components/NCoinBuySell';
import { useShare } from 'shared/useShare';
import Icon from 'shared/Icon';
import { Button } from 'shared/v1-components/Button';

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
  const [limit, setLimit] = useState<number | undefined>(6);
  const [copy, copyNotif] = useShare('copy');

  const columns = useMemo<Array<TableColumn<Pool>>>(
    () => [
      {
        title: t('pools.table.address'),
        render: row => (
          <div className="flex items-center gap-1 text-xs">
            {shortenAddress(row.address ?? '')}
            <Icon
              name={bxsCopy}
              size={12}
              className="cursor-pointer"
              onClick={() => copy(row.address ?? '')}
            />
          </div>
        ),
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
    [copy, t],
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
          dataSource={pools.data?.slice(0, limit)}
          rowKey={row => `${row.address ?? ''}${row.name ?? ''}`}
          surface={2}
          scrollable
          footer={
            (pools.data?.length ?? 0) > 6 &&
            limit && (
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
      {copyNotif}
      {hr && <hr className="border-white/10" />}
    </>
  );
}
