import { useQueryClient } from '@tanstack/react-query';
import { notification } from 'antd';
import { useWatchTokenStream } from 'modules/autoTrader/TokenActivity/useWatchTokenStream';
import { useEffect } from 'react';
import { swapsNotifications } from 'services/chains';
import { WatchEventType } from 'services/grpc/proto/wealth_manager';
import type { OrderStatus } from 'services/rest/order';

const filledOrders: string[] = [];

export const useConfirmTransaction = ({ slug }: { slug?: string }) => {
  const queryClient = useQueryClient();
  const { data } = useWatchTokenStream({ type: WatchEventType.SWAP_UPDATE });
  const { data: ordersStream } = useWatchTokenStream({
    type: WatchEventType.LIMIT_ORDER_UPDATE,
  });

  const confirm = ({ swapKey }: { swapKey: string }) => {
    invalidateQueries(swapKey);
    confirmNotification(swapKey);
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: <invalidateQueries>
  useEffect(() => {
    const swapKey = data?.swapPayload?.key;
    if (swapKey) {
      if (data.swapPayload?.status === 'COMPLETED') {
        if (swapsNotifications.has(swapKey)) {
          console.log('confirmed by stream', new Date().toISOString());
        }
        invalidateQueries(swapKey);
        confirmNotification(swapKey);
      } else if (data.swapPayload?.failReason) {
        failNotification(swapKey, data.swapPayload.failReason);
      }
    }
  }, [data]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <reason>
  useEffect(() => {
    if (!ordersStream?.orderPayload) return;
    if (filledOrders.includes(ordersStream.orderPayload.key)) return;
    if (ordersStream.orderPayload.status === ('SUCCESS' as OrderStatus)) {
      filledOrders.push(ordersStream.orderPayload.key);
      invalidateQueries();
    }
  }, [ordersStream]);

  const invalidateQueries = (swapKey?: string) => {
    if (swapKey && !swapsNotifications.has(swapKey)) return;
    if (!swapKey) {
      void queryClient.invalidateQueries({ queryKey: ['limit-orders'] });
    }
    void queryClient.invalidateQueries({ queryKey: ['sol-balance'] });
    void queryClient.invalidateQueries({
      queryKey: ['solana-user-assets'],
    });
    void queryClient.invalidateQueries({ queryKey: ['buys-sells'] });
    void queryClient.invalidateQueries({
      queryKey: ['trader-asset', slug],
    });
  };

  return { confirm };
};

const confirmNotification = (swapKey: string) => {
  if (!swapsNotifications.has(swapKey)) return;
  const notificationKey = swapsNotifications.get(swapKey);
  notification.success({
    key: notificationKey,
    message: 'Transaction confirmed!',
  });
  swapsNotifications.delete(swapKey);
};

const failNotification = (swapKey: string, failReason: string) => {
  if (!swapsNotifications.has(swapKey)) return;
  const notificationKey = swapsNotifications.get(swapKey);
  notification.success({
    key: notificationKey,
    message: `Failed to execute transaction. ${failReason}`,
  });
  swapsNotifications.delete(swapKey);
};
