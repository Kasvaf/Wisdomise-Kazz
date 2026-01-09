import { useQueryClient } from '@tanstack/react-query';
import { notification } from 'antd';
import { useWatchTokenStream } from 'modules/autoTrader/TokenActivity/useWatchTokenStream';
import { useCallback, useEffect } from 'react';
import { swapsNotifications } from 'services/chains';
import type { OrderStatus } from 'services/rest/order';

const filledOrders: string[] = [];

export const useConfirmTransaction = ({ slug }: { slug?: string }) => {
  const queryClient = useQueryClient();
  const { lastSwapPayload, lastOrderPayload } = useWatchTokenStream({ slug });

  const confirm = (params?: { swapKey: string }) => {
    if (params?.swapKey) {
      invalidateQueries(params.swapKey);
      confirmNotification(params.swapKey);
    } else {
      invalidateQueries();
    }
  };

  const invalidateQueries = useCallback(
    (swapKey?: string) => {
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
      setTimeout(() => {
        void queryClient.invalidateQueries({
          queryKey: ['swap-positions'],
        });
      }, 200);
    },
    [slug, queryClient],
  );

  useEffect(() => {
    if (!lastSwapPayload) return;

    const swapKey = lastSwapPayload.key;
    if (swapKey) {
      if (lastSwapPayload.status === 'COMPLETED') {
        if (swapsNotifications.has(swapKey)) {
          console.log('confirmed by stream', new Date().toISOString());
        }
        invalidateQueries(swapKey);
        confirmNotification(swapKey);
      } else if (lastSwapPayload.failReason) {
        failNotification(swapKey, lastSwapPayload.failReason);
      }
    }
  }, [lastSwapPayload, invalidateQueries]);

  useEffect(() => {
    if (!lastOrderPayload) return;

    if (filledOrders.includes(lastOrderPayload.key)) return;
    if (lastOrderPayload.status === ('SUCCESS' as OrderStatus)) {
      filledOrders.push(lastOrderPayload.key);
      invalidateQueries();
    }
  }, [lastOrderPayload, invalidateQueries]);

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
