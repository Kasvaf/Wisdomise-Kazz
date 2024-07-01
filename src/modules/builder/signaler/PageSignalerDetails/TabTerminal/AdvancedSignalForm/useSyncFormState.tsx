import { useEffect } from 'react';
import { type FullPosition } from 'api/builder';
import { type TpSlData, type SignalFormState } from './useSignalFormStates';

function mergeItems({
  local,
  remote,
}: {
  local: TpSlData[];
  remote: TpSlData[];
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
    priceUpdated: [, setPriceUpdated],
    takeProfits: [, setTakeProfits],
    stopLosses: [, setStopLosses],
  } = formState;

  // reset all when asset is changed
  useEffect(() => {
    setPriceUpdated(false);
    setTakeProfits([]);
    setStopLosses([]);
  }, [assetName, setPriceUpdated, setStopLosses, setTakeProfits]);

  // merge remote changes of active-position to local form state
  useEffect(() => {
    setIsUpdate(!!activePosition);

    if (activePosition?.entry_price) {
      setPrice(String(activePosition.entry_price));
    }

    if (activePosition?.position_side) {
      setMarket(activePosition.position_side.toLowerCase() as 'long' | 'short');
    }

    setTakeProfits(takeProfits =>
      mergeItems({
        local: takeProfits,
        remote:
          activePosition?.manager?.take_profit?.map(x => ({
            key: x.key,
            amountRatio: String(x.amount_ratio * 100),
            priceExact: String(x.price_exact ?? 0),
            applied: x.applied ?? false,
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
            removed: false,
          })) ?? [],
      }),
    );
  }, [
    activePosition,
    setPrice,
    setMarket,
    setIsUpdate,
    setStopLosses,
    setTakeProfits,
  ]);
};

export default useSyncFormState;
