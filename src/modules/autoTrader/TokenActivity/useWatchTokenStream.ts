import { useEffect, useMemo, useState } from 'react';
import { observeGrpc } from 'services/grpc/core';
import {
  type LimitOrder,
  type Swap,
  type SwapPosition,
  type TradeActivity,
  WatchEventType,
} from 'services/grpc/proto/wealth_manager';
import {
  useAccountQuery,
  useSwapPositionsQuery,
  useTraderAssetQuery,
} from 'services/rest';
import { slugToTokenAddress } from 'services/rest/token-info';
import { toCamelCaseObject } from 'utils/object';

export const useWatchTokenStream = ({ slug }: { slug?: string }) => {
  const [lastActivityPayload, setLastActivityPayload] =
    useState<TradeActivity>();
  const [lastPositionPayload, setLastPositionPayload] =
    useState<SwapPosition>();
  const [lastSwapPayload, setLastSwapPayload] = useState<Swap>();
  const [lastOrderPayload, setLastOrderPayload] = useState<LimitOrder>();

  const { data: account } = useAccountQuery();

  useEffect(() => {
    setLastActivityPayload(undefined);
    setLastOrderPayload(undefined);
    setLastSwapPayload(undefined);
    setLastPositionPayload(undefined);

    observeGrpc(
      {
        service: 'wealth_manager',
        method: 'watch',
        payload: {
          username: account?.username,
        },
      },
      {
        next: data => {
          if (
            data.swapPositionPayload &&
            data.swapPositionPayload.symbolSlug === slug
          ) {
            setLastPositionPayload(data.swapPositionPayload);
          } else if (data.swapPayload && data.swapPayload.baseSlug === slug) {
            setLastSwapPayload(data.swapPayload);
          } else if (
            data.activityPayload &&
            data.activityPayload.symbolSlug === slug
          ) {
            setLastActivityPayload(data.activityPayload);
          } else if (
            data.orderPayload &&
            data.orderPayload.baseAddress === slugToTokenAddress(slug)
          ) {
            setLastOrderPayload(data.orderPayload);
          }
        },
      },
    );
  }, [account?.username, slug]);

  return {
    lastPositionPayload,
    lastSwapPayload,
    lastOrderPayload,
    lastActivityPayload,
  };
};

export const useTokenActivity = ({
  slug,
  type,
}: {
  slug?: string;
  type: WatchEventType;
}) => {
  const { data: tradeHistory } = useTraderAssetQuery({ slug });
  const { data: activePositionHistory } = useSwapPositionsQuery({
    symbolSlug: slug,
  });
  const { lastActivityPayload, lastPositionPayload } = useWatchTokenStream({
    slug,
  });

  return useMemo(() => {
    return {
      data:
        type === WatchEventType.TRADE_ACTIVITY_UPDATE
          ? (lastActivityPayload ??
            toCamelCaseObject<TradeActivity | undefined>(tradeHistory))
          : (lastPositionPayload ??
            toCamelCaseObject<SwapPosition>(activePositionHistory?.results[0])),
    };
  }, [
    tradeHistory,
    lastActivityPayload,
    lastPositionPayload,
    type,
    activePositionHistory,
  ]);
};
