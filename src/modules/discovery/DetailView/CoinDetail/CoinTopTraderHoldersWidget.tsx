import {
  type CoinTopTraderHolder,
  useCoinTopTraderHolders,
} from 'api/discovery';
import { clsx } from 'clsx';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { DirectionalNumber } from 'shared/DirectionalNumber';
import { ReadableNumber } from 'shared/ReadableNumber';
import { Button } from 'shared/v1-components/Button';
import { Table, type TableColumn } from 'shared/v1-components/Table';
import { Wallet } from '../WhaleDetail/Wallet';
import { useUnifiedCoinDetails } from './lib';

export function CoinTopTraderHoldersWidget({
  type,
  title,
  id,
  limit: _limit = 6,
  hr,
  className,
}: {
  type: Parameters<typeof useCoinTopTraderHolders>[0]['type'];
  title?: boolean;
  limit?: number;
  id?: string;
  hr?: boolean;
  className?: string;
}) {
  const { t } = useTranslation();
  const [limit, setLimit] = useState<number | undefined>(_limit);
  const { symbol } = useUnifiedCoinDetails();
  const resp = useCoinTopTraderHolders({
    type,
    slug: symbol.slug,
  });

  const columns = useMemo<Array<TableColumn<CoinTopTraderHolder>>>(
    () => [
      {
        title: 'Address',
        // sticky: 'start',
        render: row => (
          <Wallet
            className="[&_img]:hidden"
            noLink
            wallet={{
              address: row.wallet_address,
              network: row.network,
            }}
            whale={false}
          />
        ),
      },
      {
        title: 'Bought',
        render: row => (
          <div className="flex flex-col gap-px">
            <ReadableNumber
              className="text-xs"
              label="$"
              popup="never"
              value={row.volume_inflow}
            />
            <ReadableNumber
              className="text-v1-content-secondary text-xxs"
              format={{
                compactInteger: false,
              }}
              label="TXs"
              popup="never"
              value={row.num_inflows}
            />
          </div>
        ),
      },
      {
        title: 'Sold',
        render: row => (
          <div className="flex flex-col gap-px">
            <ReadableNumber
              className="text-xs"
              label="$"
              popup="never"
              value={row.volume_outflow}
            />
            <ReadableNumber
              className="text-v1-content-secondary text-xxs"
              format={{
                compactInteger: false,
              }}
              label="TXs"
              popup="never"
              value={row.num_outflows}
            />
          </div>
        ),
      },
      // {
      //   title: 'PnL',
      //   render: row => (
      //     <DirectionalNumber
      //       className="text-xs"
      //       label="$"
      //       popup="never"
      //       showIcon={false}
      //       showSign
      //       value={row.pnl}
      //     />
      //   ),
      // },
      {
        title: 'Realized PnL',
        render: row => (
          <DirectionalNumber
            className="text-xs"
            label="$"
            popup="never"
            showIcon={false}
            showSign
            value={row.realized_pnl}
          />
        ),
      },
      {
        title: 'Avg Cost',
        render: row => (
          <ReadableNumber
            className="text-xs"
            label="$"
            popup="never"
            value={row.average_buy}
          />
        ),
      },
      {
        hidden: type === 'traders',
        title: 'Balance',
        render: row => (
          <div className="flex flex-col items-start gap-px">
            <ReadableNumber
              className="text-xs"
              label="$"
              popup="never"
              value={row.balance}
            />
            <DirectionalNumber
              className="text-xxs"
              label="%"
              popup="never"
              showIcon={false}
              showSign
              suffix="(7D)"
              value={(row.balance - row.balance_first) / (row.balance / 100)}
            />
          </div>
        ),
      },
    ],
    [type],
  );

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
            {type === 'holders' ? 'Top Holders' : 'Top Traders'}
          </h3>
        )}
        <Table
          columns={columns}
          dataSource={resp.data?.slice?.(0, limit) ?? []}
          footer={
            typeof limit === 'number' &&
            (resp.data?.length ?? 0) > limit && (
              <Button
                onClick={() => setLimit(undefined)}
                size="xs"
                variant="link"
              >
                {t('common:load-more')}
              </Button>
            )
          }
          loading={resp.isLoading}
          rowKey={row => `${row.wallet_address}${row.network ?? ''}`}
          scrollable
          surface={1}
        />
      </div>
      {hr && <hr className="border-white/10" />}
    </>
  );
}
