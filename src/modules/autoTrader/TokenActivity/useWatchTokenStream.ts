import { useMemo } from 'react';
import { useGrpc } from 'services/grpc/core';
import {
  type TradeActivity,
  WatchEventType,
} from 'services/grpc/proto/wealth_manager';
import { useAccountQuery, useTraderAssetQuery } from 'services/rest';
import { toCamelCaseObject } from 'utils/object';

export const useWatchTokenStream = ({
  slug,
  type,
}: {
  slug?: string;
  type?: WatchEventType;
}) => {
  const { data: account } = useAccountQuery();
  return useGrpc({
    service: 'wealth_manager',
    method: 'watch',
    payload: {
      username: account?.username,
      symbolSlug: slug,
    },
    enabled: !!slug,
    history: 100,
    filter: type ? data => data?.type === type : undefined,
  });
};

export const useTokenActivity = ({ slug }: { slug?: string }) => {
  const { data: history } = useTraderAssetQuery({ slug });
  const { data: stream } = useWatchTokenStream({
    slug,
    type: WatchEventType.TRADE_ACTIVITY_UPDATE,
  });

  return useMemo(() => {
    return {
      data:
        stream?.activityPayload ??
        toCamelCaseObject<TradeActivity | undefined>(history),
    };
  }, [history, stream]);
};
