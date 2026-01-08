import {
  calcPnl,
  calcPnlPercent,
} from 'modules/autoTrader/TokenActivity/utils';
import { useActiveQuote } from 'modules/autoTrader/useActiveQuote';
import { useActiveNetwork } from 'modules/base/active-network';
import { useEffect, useMemo, useState } from 'react';
import { observeGrpc } from 'services/grpc/core';
import {
  type LimitOrder,
  type Swap,
  type SwapPosition,
  type TradeActivity,
  WatchEventType,
} from 'services/grpc/proto/wealth_manager';
import { useLastPriceStream } from 'services/price';
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
          if (data.swapPositionPayload?.symbolSlug === slug) {
            setLastPositionPayload(data.swapPositionPayload);
          } else if (data.swapPayload?.baseSlug === slug) {
            setLastSwapPayload(data.swapPayload);
          } else if (data.activityPayload?.symbolSlug === slug) {
            setLastActivityPayload(data.activityPayload);
          } else if (
            data.orderPayload?.baseAddress === slugToTokenAddress(slug)
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
  const network = useActiveNetwork();
  const [quote] = useActiveQuote();
  const { data: tradeHistory } = useTraderAssetQuery({ slug });
  const { data: activePositionHistory } = useSwapPositionsQuery({
    symbolSlug: slug,
  });
  const { lastActivityPayload, lastPositionPayload } = useWatchTokenStream({
    slug,
  });

  const { data: price } = useLastPriceStream({
    network,
    slug: slug,
    quote,
  });

  const { data: priceUsd } = useLastPriceStream({
    network,
    slug: slug,
    quote,
    convertToUsd: true,
  });

  const data = useMemo(() => {
    return type === WatchEventType.TRADE_ACTIVITY_UPDATE
      ? (lastActivityPayload ??
          toCamelCaseObject<TradeActivity | undefined>(tradeHistory))
      : (lastPositionPayload ??
          toCamelCaseObject<SwapPosition>(activePositionHistory?.results[0]));
  }, [
    tradeHistory,
    lastActivityPayload,
    lastPositionPayload,
    type,
    activePositionHistory,
  ]);

  const bought = Number(data?.totalBought ?? '0');
  const boughtUsd = Number(data?.totalBoughtUsd ?? '0');

  const sold = Number(data?.totalSold ?? '0');
  const soldUsd = Number(data?.totalSoldUsd ?? '0');

  const balance = Number(data?.balance ?? '0');
  const hold = balance * (price ?? 0);
  const holdUsd = balance * (priceUsd ?? 0);

  const pnl = calcPnl(bought, sold, balance, price ?? 0);
  const pnlUsd = calcPnl(boughtUsd, soldUsd, balance, priceUsd ?? 0);

  const boughtBalance = bought / (price ?? 0);
  const init = Math.min(boughtBalance, balance);

  const pnlPercent = calcPnlPercent(bought, pnl);
  const pnlUsdPercent = calcPnlPercent(boughtUsd, pnlUsd);
  const pnlSign = pnl >= 0 ? '+' : '-';

  return {
    init,
    bought,
    boughtUsd,
    sold,
    soldUsd,
    balance,
    hold,
    holdUsd,
    pnl,
    pnlUsd,
    pnlPercent,
    pnlUsdPercent,
    pnlSign,
  };
};
