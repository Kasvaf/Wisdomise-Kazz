import { notification, Pagination } from 'antd';
import {
  type Order,
  type OrderStatus,
  useOrderCancelMutation,
  useOrdersQuery,
} from 'api/order';
import { useTokenInfo } from 'api/token-info';
import { clsx } from 'clsx';
import { TraderPresetValues } from 'modules/autoTrader/BuySellTrader/TraderPresets';
import { useCallback, useMemo, useState } from 'react';
import { ReadableNumber } from 'shared/ReadableNumber';
import { Badge, type BadgeColor } from 'shared/v1-components/Badge';
import { Button } from 'shared/v1-components/Button';
import { Table, type TableColumn } from 'shared/v1-components/Table';
import { Token } from 'shared/v1-components/Token';

export const orderTypeMap: Record<
  Order['type'],
  { label: string; color: BadgeColor }
> = {
  BUY_BELOW: { label: 'Buy Below', color: 'positive' },
  BUY_ABOVE: { label: 'Buy Above', color: 'positive' },
  SELL_BELOW: { label: 'Sell Below', color: 'negative' },
  SELL_ABOVE: { label: 'Sell Above', color: 'negative' },
} as const;

export const orderStatusMap: Record<
  OrderStatus,
  { label: string; color: BadgeColor }
> = {
  PENDING: { label: 'Active', color: 'brand' },
  SUCCESS: { label: 'Success', color: 'positive' },
  FAILED: { label: 'Failed', color: 'negative' },
  CANCELED: { label: 'Canceled', color: 'negative' },
} as const;

const PAGE_SIZE = 10;

export default function Orders({
  className,
  id,
  title = false,
  walletAddress,
}: {
  className?: string;
  id?: string;
  title?: boolean;
  walletAddress?: string;
}) {
  const [page, setPage] = useState(1);
  const { data: orders, isLoading } = useOrdersQuery({
    walletAddress,
    page,
    size: PAGE_SIZE,
  });
  const { mutateAsync } = useOrderCancelMutation();

  const cancelOrder = useCallback(
    (key: string) => {
      mutateAsync(key).then(() => {
        notification.success({ message: 'Order cancelled' });
      });
    },
    [mutateAsync],
  );

  const columns = useMemo<Array<TableColumn<Order>>>(
    () => [
      {
        key: 'token',
        title: 'Token',
        render: row => (
          <Token address={row.base_address} autoFill showAddress={false} />
        ),
      },
      {
        key: 'status',
        title: 'Status',
        render: row => (
          <Badge color={orderStatusMap[row.status].color}>
            {orderStatusMap[row.status].label}
          </Badge>
        ),
      },
      {
        key: 'type',
        title: 'Type',
        render: row => (
          <Badge color={orderTypeMap[row.type].color}>
            {orderTypeMap[row.type].label}
          </Badge>
        ),
      },
      {
        key: 'amount',
        title: 'Amount',
        render: row => (
          <div className="flex items-center gap-1">
            <Token
              address={
                row.type === 'BUY_ABOVE' || row.type === 'BUY_BELOW'
                  ? row.quote_address
                  : row.base_address
              }
              autoFill
              icon
              size="xs"
            />
            <ReadableNumber
              format={{ compactInteger: true }}
              value={+row.amount}
            />
          </div>
        ),
      },
      {
        key: 'target',
        title: 'Target MC',
        render: row => <TargetMC order={row} />,
      },
      {
        key: 'settings',
        title: 'Settings',
        render: row => (
          <div className="flex flex-col gap-1 text-v1-content-primary/70">
            <TraderPresetValues
              value={{
                slippage: row.slippage,
                sol_priority_fee: row.priority_fee,
                sol_bribe_fee: '',
              }}
            />
            {new Date(row.created_at).toLocaleString()}
          </div>
        ),
      },
      {
        key: 'actions',
        title: 'Actions',
        render: row =>
          row.status === 'PENDING' && (
            <Button
              onClick={() => cancelOrder(row.key)}
              size="2xs"
              variant="negative_outline"
            >
              Cancel
            </Button>
          ),
      },
    ],
    [cancelOrder],
  );

  return (
    <div
      className={clsx(
        'relative flex flex-col gap-4 overflow-auto overflow-x-hidden',
        className,
      )}
      id={id}
    >
      {title !== false && (
        <h3 className="font-semibold text-sm">Top Traders</h3>
      )}
      <Table
        columns={columns}
        dataSource={orders?.results}
        footer={
          <Pagination
            current={page}
            hideOnSinglePage
            onChange={x => setPage(x)}
            pageSize={PAGE_SIZE}
            responsive
            total={orders?.count}
          />
        }
        loading={isLoading}
        rowClassName="text-xs"
        rowKey={row => row.key}
        scrollable
        surface={1}
      />
    </div>
  );
}

const TargetMC = ({ order }: { order: Order }) => {
  const { data: tokenInfo, isPending } = useTokenInfo({
    tokenAddress: order.base_address,
  });
  const { data: quoteInfo } = useTokenInfo({
    tokenAddress: order.quote_address,
  });
  return (
    <div>
      {isPending ? (
        <div className="h-6 w-20 rounded-xl bg-v1-surface-l1" />
      ) : (
        <>
          <ReadableNumber
            format={{ decimalLength: 3, compactInteger: true }}
            label={order.price_in_usd ? '$' : ''}
            value={+order.price * (tokenInfo?.total_supply ?? 0)}
          />
          {!order.price_in_usd && (
            <span className="ml-1">{quoteInfo?.symbol}</span>
          )}
        </>
      )}
    </div>
  );
};
