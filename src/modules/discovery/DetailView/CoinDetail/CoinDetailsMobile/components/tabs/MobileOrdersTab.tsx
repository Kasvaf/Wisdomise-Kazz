import { notification, Pagination } from 'antd';
import { TraderPresetValues } from 'modules/autoTrader/BuySellTrader/TraderPresets';
import { useCallback, useMemo, useState } from 'react';
import {
  type Order,
  useOrderCancelMutation,
  useOrdersQuery,
} from 'services/rest/order';
import { useTokenInfo } from 'services/rest/token-info';
import { ReadableNumber } from 'shared/ReadableNumber';
import { Badge } from 'shared/v1-components/Badge';
import { Button } from 'shared/v1-components/Button';
import { Table, type TableColumn } from 'shared/v1-components/Table';
import { Token } from 'shared/v1-components/Token';
import {
  orderStatusMap,
  orderTypeMap,
} from '../../../CoinDetailsExpanded/Orders';

const TargetMC = ({ order }: { order: Order }) => {
  const { data: tokenInfo, isPending } = useTokenInfo({
    tokenAddress: order.base_address,
  });
  if (isPending)
    return <span className="text-[8px] text-neutral-600">...</span>;
  return (
    <ReadableNumber
      className="text-[8px] text-neutral-600"
      format={{
        decimalLength: 2,
        compactInteger: true,
        minifyDecimalRepeats: false,
      }}
      label={order.price_in_usd ? '$' : ''}
      value={+order.price * (tokenInfo?.total_supply ?? 0)}
    />
  );
};

export function MobileOrdersTab({ walletAddress }: { walletAddress?: string }) {
  const [ordersPage, setOrdersPage] = useState(1);
  const { data: orders, isLoading: ordersLoading } = useOrdersQuery({
    walletAddress,
    page: ordersPage,
    size: 10,
  });
  const { mutateAsync: cancelOrder } = useOrderCancelMutation();

  const handleCancelOrder = useCallback(
    async (key: string, e: React.MouseEvent) => {
      e.stopPropagation();
      try {
        await cancelOrder(key);
        notification.success({ message: 'Order cancelled' });
      } catch (_error) {
        notification.error({ message: 'Failed to cancel order' });
      }
    },
    [cancelOrder],
  );

  const columns = useMemo<Array<TableColumn<Order>>>(
    () => [
      {
        key: 'token',
        title: 'Token',
        width: 110,
        render: row => (
          <div className="flex flex-col gap-0.5">
            <Token address={row.base_address} autoFill icon size="xs" />
            <Badge
              color={orderTypeMap[row.type].color}
              size="sm"
              variant="soft"
            >
              {orderTypeMap[row.type].label}
            </Badge>
          </div>
        ),
      },
      {
        key: 'status',
        title: 'Status',
        align: 'center',
        width: 70,
        render: row => (
          <Badge color={orderStatusMap[row.status].color} size="sm">
            {orderStatusMap[row.status].label}
          </Badge>
        ),
      },
      {
        key: 'amount',
        title: 'Amount',
        align: 'end',
        width: 100,
        render: row => (
          <div className="flex flex-col items-end gap-0.5">
            <div className="flex items-center gap-0.5">
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
                className="font-mono text-[10px] text-white"
                format={{
                  compactInteger: true,
                  decimalLength: 2,
                  minifyDecimalRepeats: false,
                }}
                value={+row.amount}
              />
            </div>
            <TargetMC order={row} />
          </div>
        ),
      },
      {
        key: 'settings',
        title: 'Settings',
        align: 'end',
        width: 90,
        render: row => (
          <div className="flex flex-col items-end gap-0.5">
            <TraderPresetValues
              value={{
                slippage: row.slippage,
                sol_priority_fee: row.priority_fee,
                sol_bribe_fee: '',
              }}
            />
            <div className="text-[8px] text-neutral-600">
              {new Date(row.created_at).toLocaleString('en-US', {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </div>
          </div>
        ),
      },
      {
        key: 'actions',
        title: 'Actions',
        align: 'center',
        width: 70,
        render: row =>
          row.status === 'PENDING' && (
            <Button
              onClick={e => handleCancelOrder(row.key, e)}
              size="2xs"
              variant="negative_outline"
            >
              Cancel
            </Button>
          ),
      },
    ],
    [handleCancelOrder],
  );

  return (
    <div className="flex-1 overflow-auto bg-v1-background-primary">
      <Table
        chunkSize={20}
        columns={columns}
        dataSource={orders?.results}
        emptyMessage="No orders found"
        footer={
          orders && orders.count > 10 ? (
            <Pagination
              current={ordersPage}
              hideOnSinglePage
              onChange={x => setOrdersPage(x)}
              pageSize={10}
              responsive
              size="small"
              total={orders.count}
            />
          ) : undefined
        }
        loading={ordersLoading}
        minWidth={500}
        rowKey={row => row.key}
        scrollable
        size="xs"
        surface={0}
      />
    </div>
  );
}
