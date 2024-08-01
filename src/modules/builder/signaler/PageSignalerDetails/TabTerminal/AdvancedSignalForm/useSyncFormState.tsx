import { useEffect, useState } from 'react';
import { type FullPosition } from 'api/builder';
import { type SignalFormState } from './useSignalFormStates';

interface Mergeable {
  key: string;
  applied: boolean;
}

function mergeItems<T extends Mergeable>({
  local,
  remote,
}: {
  local: T[];
  remote: T[];
}) {
  if (remote.length > local.length) return remote;

  // reset remote items which are applied
  const remoteByKey = Object.fromEntries(remote.map(x => [x.key, x]));
  return local.map(localItem =>
    remoteByKey[localItem.key]?.applied
      ? remoteByKey[localItem.key]
      : localItem,
  );
}

const useSyncFormState = ({
  formState,
  assetName,
  activePosition,
}: {
  formState: SignalFormState;
  assetName: string;
  activePosition?: FullPosition;
}) => {
  const {
    isUpdate: [, setIsUpdate],
    price: [, setPrice],
    market: [, setMarket],
    volume: [, setVolume],
    orderType: [, setOrderType],
    conditions: [, setConditions],
    priceUpdated: [, setPriceUpdated],
    takeProfits: [, setTakeProfits],
    stopLosses: [, setStopLosses],
    safetyOpens: [, setSafetyOpens],
  } = formState;

  // reset all when asset is changed
  useEffect(() => {
    setPriceUpdated(false);
    setTakeProfits([]);
    setStopLosses([]);
    setSafetyOpens([]);
    setOrderType('market');
    setVolume('100');
    setConditions([]);
  }, [
    assetName,
    setConditions,
    setOrderType,
    setPriceUpdated,
    setSafetyOpens,
    setStopLosses,
    setTakeProfits,
    setVolume,
  ]);

  const [pair, setPair] = useState<string>();
  // merge remote changes of active-position to local form state
  useEffect(() => {
    setIsUpdate(!!activePosition);

    if (activePosition?.position_side) {
      setMarket(activePosition.position_side.toLowerCase() as 'long' | 'short');
    }

    const firstOrder = activePosition?.manager?.open_orders?.[0];
    if (
      activePosition &&
      firstOrder &&
      (firstOrder.applied || activePosition.pair_name !== pair)
    ) {
      setPair(activePosition.pair_name);

      const price = firstOrder.price ?? activePosition.entry_price;
      setPrice(price ? String(price) : '');

      setOrderType(firstOrder.order_type);
      setVolume(String((firstOrder.amount ?? 1) * 100));
      setConditions(
        firstOrder.condition.type === 'compare' ? [firstOrder.condition] : [],
      );
    }

    setSafetyOpens(safetyOpens =>
      mergeItems({
        local: safetyOpens,
        remote:
          activePosition?.manager?.open_orders?.slice(1)?.map(x => ({
            key: x.key,
            amountRatio: String((x.amount ?? 0) * 100),
            priceExact: String(
              (x.condition.type === 'true' ? x.price : x.condition.right) ?? 0,
            ),
            applied: x.applied ?? false,
            appliedAt: x.applied_at ? new Date(x.applied_at) : undefined,
            removed: false,
          })) ?? [],
      }),
    );

    setTakeProfits(takeProfits =>
      mergeItems({
        local: takeProfits,
        remote:
          activePosition?.manager?.take_profit?.map(x => ({
            key: x.key,
            amountRatio: String(x.amount_ratio * 100),
            priceExact: String(x.price_exact ?? 0),
            applied: x.applied ?? false,
            appliedAt: x.applied_at ? new Date(x.applied_at) : undefined,
            removed: false,
          })) ?? [],
      }),
    );

    setStopLosses(stopLosses =>
      mergeItems({
        local: stopLosses,
        remote:
          activePosition?.manager?.stop_loss?.map(x => ({
            key: x.key,
            amountRatio: String(x.amount_ratio * 100),
            priceExact: String(x.price_exact ?? 0),
            applied: x.applied ?? false,
            appliedAt: x.applied_at ? new Date(x.applied_at) : undefined,
            removed: false,
          })) ?? [],
      }),
    );
  }, [
    activePosition,
    pair,
    setPrice,
    setMarket,
    setIsUpdate,
    setStopLosses,
    setTakeProfits,
    setSafetyOpens,
    setOrderType,
    setConditions,
    setVolume,
  ]);
};

export default useSyncFormState;
