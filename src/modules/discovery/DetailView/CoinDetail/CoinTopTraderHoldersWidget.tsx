import { useMemo, useState } from 'react';
import { clsx } from 'clsx';
import { useTranslation } from 'react-i18next';
import {
  type CoinTopTraderHolder,
  useCoinTopTraderHolders,
} from 'api/discovery';
import { Table, type TableColumn } from 'shared/v1-components/Table';
import { Button } from 'shared/v1-components/Button';
import { ReadableNumber } from 'shared/ReadableNumber';
import { DirectionalNumber } from 'shared/DirectionalNumber';
import { Wallet } from '../WhaleDetail/Wallet';

export function CoinTopTraderHoldersWidget({
  type,
  slug,
  title,
  id,
  limit: _limit = 6,
  hr,
  className,
}: {
  type: Parameters<typeof useCoinTopTraderHolders>[0]['type'];
  title?: boolean;
  slug: string;
  limit?: number;
  id?: string;
  hr?: boolean;
  className?: string;
}) {
  const { t } = useTranslation();
  const [limit, setLimit] = useState<number | undefined>(_limit);
  const resp = useCoinTopTraderHolders({
    type,
    slug,
  });

  const columns = useMemo<Array<TableColumn<CoinTopTraderHolder>>>(
    () => [
      {
        title: 'Address',
        sticky: 'start',
        render: row => (
          <Wallet
            wallet={{
              address: row.wallet_address,
              network: row.network,
            }}
            noLink
            whale={false}
          />
        ),
      },
      {
        title: 'Bought',
        render: row => (
          <div className="flex flex-col gap-px">
            <ReadableNumber
              value={row.volume_inflow}
              label="$"
              popup="never"
              className="text-xs"
            />
            <ReadableNumber
              value={row.num_inflows}
              label="TXs"
              popup="never"
              format={{
                compactInteger: false,
              }}
              className="text-xxs text-v1-content-secondary"
            />
          </div>
        ),
      },
      {
        title: 'Sold',
        render: row => (
          <div className="flex flex-col gap-px">
            <ReadableNumber
              value={row.volume_outflow}
              label="$"
              popup="never"
              className="text-xs"
            />
            <ReadableNumber
              value={row.num_outflows}
              label="TXs"
              popup="never"
              format={{
                compactInteger: false,
              }}
              className="text-xxs text-v1-content-secondary"
            />
          </div>
        ),
      },
      {
        title: 'PnL',
        render: row => (
          <DirectionalNumber
            value={row.pnl}
            label="$"
            popup="never"
            className="text-xs"
            showSign
            showIcon={false}
          />
        ),
      },
      {
        title: 'Realized PnL',
        render: row => (
          <DirectionalNumber
            value={row.realized_pnl}
            label="$"
            popup="never"
            className="text-xs"
            showSign
            showIcon={false}
          />
        ),
      },
      {
        title: 'Avg Cost',
        render: row => (
          <ReadableNumber
            value={row.average_buy}
            label="$"
            popup="never"
            className="text-xs"
          />
        ),
      },
      {
        hidden: type === 'traders',
        title: 'Balance',
        render: row => (
          <div className="flex flex-col items-start gap-px">
            <ReadableNumber
              value={row.balance}
              label="$"
              popup="never"
              className="text-xs"
            />
            <DirectionalNumber
              value={(row.balance - row.balance_first) / (row.balance / 100)}
              label="%"
              suffix="(7D)"
              popup="never"
              className="text-xxs"
              showIcon={false}
              showSign
            />
          </div>
        ),
      },
    ],
    [type],
  );

  if ((resp.data ?? []).length === 0) return null;

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
            {type === 'holders' ? 'Top Holders' : 'Top Traders'}
          </h3>
        )}
        <Table
          loading={resp.isLoading}
          columns={columns}
          dataSource={resp.data?.slice?.(0, limit) ?? []}
          rowKey={row => `${row.wallet_address}${row.network ?? ''}`}
          surface={2}
          scrollable
          footer={
            typeof limit === 'number' &&
            (resp.data?.length ?? 0) > limit && (
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
