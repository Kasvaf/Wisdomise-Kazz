import { v4 } from 'uuid';
import { useEffect, useState } from 'react';
import { initialQuoteDeposit, type Position } from 'api';
import { type SignalItem } from 'api/builder';
import { roundSensible } from 'utils/numbers';
import { type TpSlData, type SignalFormState } from './useSignalFormStates';

interface Mergeable {
  key: string;
  applied: boolean;
}

function fromApiContract(items?: SignalItem[]) {
  const result: TpSlData[] = [];
  if (!items?.length) return result;

  let prevSum = 0;
  for (const x of items) {
    const amount = x.amount_ratio * (1 - prevSum);
    prevSum += amount;
    result.push({
      key: x.key,
      amountRatio: roundSensible(100 * amount),
      priceExact: String(x.price_exact ?? 0),
      applied: (x.applied ?? false) || x.applied_at != null,
      appliedAt: x.applied_at ? new Date(x.applied_at) : undefined,
      removed: false,
    });
  }
  return result;
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
  baseSlug,
  activePosition,
}: {
  formState: SignalFormState;
  baseSlug: string;
  activePosition?: Position;
}) => {
  const {
    isUpdate: [, setIsUpdate],
    amount: [, setAmount],
    quote: [quote, setQuote],
    leverage: [, setLeverage],

    maxOrders: [, setMaxOrders],
    takeProfits: [, setTakeProfits],
    stopLosses: [, setStopLosses],
    safetyOpens: [, setSafetyOpens],
  } = formState;

  // reset all when asset is changed
  useEffect(() => {
    setTakeProfits([]);
    setStopLosses([]);
    setSafetyOpens([
      {
        amountRatio: '100',
        applied: false,
        isMarket: true,
        removed: false,
        priceExact: '',
        key: v4(),
      },
    ]);
    setMaxOrders(100);
  }, [
    quote,
    baseSlug,
    setMaxOrders,
    setSafetyOpens,
    setStopLosses,
    setTakeProfits,
  ]);

  const [pairSlug, setPair] = useState<string>();
  // merge remote changes of active-position to local form state
  useEffect(() => {
    setIsUpdate(!!activePosition);

    if (activePosition) {
      setQuote(activePosition.quote_slug as any);

      const amount = initialQuoteDeposit(activePosition);
      if (amount !== undefined) setAmount(String(amount));

      // cannot increase orders
      setMaxOrders(
        (activePosition?.manager?.open_orders?.length ?? 0) +
          (activePosition?.manager?.take_profit?.length ?? 0) +
          (activePosition?.manager?.stop_loss?.length ?? 0),
      );
    }

    const firstOrder = activePosition?.manager?.open_orders?.[0];
    if (
      activePosition &&
      firstOrder &&
      (firstOrder.applied || activePosition.pair_slug !== pairSlug)
    ) {
      setPair(activePosition.pair_slug);

      const price = firstOrder.price ?? activePosition.entry_price;
      setSafetyOpens(so =>
        so?.[0].isMarket
          ? so.map((x, i) =>
              i ? x : { ...x, priceExact: price ? String(price) : '' },
            )
          : so,
      );
    }

    const dummyOpen = !activePosition?.manager?.open_orders?.[0].amount;
    setSafetyOpens(safetyOpens =>
      mergeItems({
        local: safetyOpens,
        remote:
          activePosition?.manager?.open_orders
            ?.slice(dummyOpen ? 1 : 0)
            ?.map((x, i) => ({
              key: x.key,
              amountRatio: String((x.amount ?? 0) * 100),
              priceExact: String(
                (x.condition.type === 'true' ? x.price : x.condition.right) ??
                  0,
              ),
              applied: x.applied ?? false,
              appliedAt:
                x.applied && x.applied_at ? new Date(x.applied_at) : undefined,
              removed: false,
              isMarket: !i && !dummyOpen, // only first if no dummy was present
            })) ?? [],
      }),
    );

    setTakeProfits(takeProfits =>
      mergeItems({
        local: takeProfits,
        remote: fromApiContract(activePosition?.manager?.take_profit),
      }),
    );

    setStopLosses(stopLosses =>
      mergeItems({
        local: stopLosses,
        remote: fromApiContract(activePosition?.manager?.stop_loss),
      }),
    );
  }, [
    activePosition,
    pairSlug,
    setAmount,
    setQuote,
    setLeverage,
    setIsUpdate,
    setStopLosses,
    setTakeProfits,
    setSafetyOpens,
    setMaxOrders,
  ]);
};

export default useSyncFormState;
