import { notification } from 'antd';
import { TraderPresetValues } from 'modules/autoTrader/BuySellTrader/TraderPresets';
import { useState } from 'react';
import {
  type Order,
  useOrderCancelMutation,
  useOrdersQuery,
} from 'services/rest/order';
import { useTokenInfo } from 'services/rest/token-info';
import { ReadableNumber } from 'shared/ReadableNumber';
import { Badge } from 'shared/v1-components/Badge';
import { Button } from 'shared/v1-components/Button';
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
      format={{ decimalLength: 2, compactInteger: true }}
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

  const handleCancelOrder = async (key: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await cancelOrder(key);
      notification.success({ message: 'Order cancelled' });
    } catch (_error) {
      notification.error({ message: 'Failed to cancel order' });
    }
  };

  return (
    <div className="flex-1 overflow-auto">
      <div className="min-w-[500px]">
        {/* Header */}
        <div className="sticky top-0 z-10 grid grid-cols-[minmax(90px,110px)_70px_minmax(85px,100px)_minmax(75px,90px)_70px] gap-1 border-v1-border-tertiary border-b bg-v1-background-primary px-2 py-1.5 font-medium text-[9px] text-neutral-600">
          <div>Token</div>
          <div className="text-center">Status</div>
          <div className="text-right">Amount</div>
          <div className="text-right">Settings</div>
          <div className="text-center">Actions</div>
        </div>

        {/* Loading State */}
        {ordersLoading && (
          <div className="flex items-center justify-center py-8">
            <span className="text-[10px] text-neutral-600">Loading...</span>
          </div>
        )}

        {/* Empty State */}
        {!ordersLoading &&
          (!orders?.results || orders.results.length === 0) && (
            <div className="flex items-center justify-center py-8">
              <span className="text-[10px] text-neutral-600">
                No orders found
              </span>
            </div>
          )}

        {/* Orders List */}
        {!ordersLoading &&
          orders?.results &&
          orders.results.map(order => (
            <div
              className="grid grid-cols-[minmax(90px,110px)_70px_minmax(85px,100px)_minmax(75px,90px)_70px] items-center gap-1 border-v1-background-primary border-b px-2 py-1.5 transition-colors hover:bg-v1-background-primary"
              key={order.key}
            >
              {/* Token + Type */}
              <div className="flex flex-col gap-0.5">
                <Token address={order.base_address} autoFill icon size="xs" />
                <Badge
                  color={orderTypeMap[order.type].color}
                  size="sm"
                  variant="soft"
                >
                  {orderTypeMap[order.type].label}
                </Badge>
              </div>

              {/* Status */}
              <div className="flex justify-center">
                <Badge color={orderStatusMap[order.status].color} size="sm">
                  {orderStatusMap[order.status].label}
                </Badge>
              </div>

              {/* Amount + Target MC */}
              <div className="text-right">
                <div className="flex items-center justify-end gap-0.5">
                  <Token
                    address={
                      order.type === 'BUY_ABOVE' || order.type === 'BUY_BELOW'
                        ? order.quote_address
                        : order.base_address
                    }
                    autoFill
                    icon
                    size="xs"
                  />
                  <ReadableNumber
                    className="font-mono text-[10px] text-white"
                    format={{ compactInteger: true }}
                    value={+order.amount}
                  />
                </div>
                <div className="text-[8px] text-neutral-600">
                  <TargetMC order={order} />
                </div>
              </div>

              {/* Settings */}
              <div className="text-right">
                <div className="flex justify-end">
                  <TraderPresetValues
                    value={{
                      slippage: order.slippage,
                      sol_priority_fee: order.priority_fee,
                      sol_bribe_fee: '',
                    }}
                  />
                </div>
                <div className="text-[8px] text-neutral-600">
                  {new Date(order.created_at).toLocaleString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-center">
                {order.status === 'PENDING' && (
                  <Button
                    onClick={e => handleCancelOrder(order.key, e)}
                    size="2xs"
                    variant="negative_outline"
                  >
                    Cancel
                  </Button>
                )}
              </div>
            </div>
          ))}

        {/* Pagination */}
        {orders && orders.count > 10 && (
          <div className="sticky bottom-0 border-v1-border-tertiary border-t bg-v1-background-primary px-2 py-2">
            <div className="flex items-center justify-between text-[10px]">
              <Button
                disabled={ordersPage === 1}
                onClick={() => setOrdersPage(p => p - 1)}
                size="2xs"
                variant="ghost"
              >
                Previous
              </Button>
              <span className="text-neutral-600">
                Page {ordersPage} of {Math.ceil(orders.count / 10)}
              </span>
              <Button
                disabled={ordersPage * 10 >= orders.count}
                onClick={() => setOrdersPage(p => p + 1)}
                size="2xs"
                variant="ghost"
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
