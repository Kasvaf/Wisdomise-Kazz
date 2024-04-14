import { useState, useEffect, useCallback } from 'react';
import { notification } from 'antd';
import {
  type SignalerData,
  type FullPosition,
  useSignalerAssetPrice,
  useFireSignalMutation,
} from 'api/builder';
import { roundDown } from 'utils/numbers';
import { unwrapErrorMessage } from 'utils/error';
import useConfirm from 'shared/useConfirm';
import AmountInputBox from 'shared/AmountInputBox';
import Button from 'shared/Button';
import MarketToggle from './MarketToggle';
import DurationInput from './DurationInput';
import OrderTypeToggle from './OrderTypeToggle';

function parseDur(dur: string) {
  const val = Number.parseInt(dur);
  const d = new Date();
  switch (dur.replace(/\d+/, '')) {
    case 's': {
      d.setSeconds(d.getSeconds() + val);
      break;
    }
    case 'm': {
      d.setMinutes(d.getMinutes() + val);
      break;
    }
    case 'h': {
      d.setHours(d.getHours() + val);
      break;
    }
    case 'd': {
      d.setDate(d.getDate() + val);
      break;
    }
    case 'M': {
      d.setMonth(d.getMonth() + val);
      break;
    }
  }
  return d.toISOString();
}

interface Props {
  signaler: SignalerData;
  assetName: string;
  activePosition?: FullPosition;
}

const SignalForm: React.FC<Props> = ({
  signaler,
  assetName,
  activePosition,
}) => {
  const isUpdate = !!activePosition;

  const [market, setMarket] = useState<'long' | 'short'>('long');
  const [orderType, setOrderType] = useState<'limit' | 'market'>('market');
  const [price, setPrice] = useState('');
  const [tp, setTP] = useState('');
  const [sl, setSL] = useState('');
  const [exp, setExp] = useState('1h');
  const [orderExp, setOrderExp] = useState('1h');

  useEffect(() => {
    setPrice('');
    setTP('');
    setSL('');
  }, [assetName]);

  useEffect(() => {
    if (activePosition) {
      setTP(String(activePosition.take_profit));
      setSL(String(activePosition.stop_loss));
    }
  }, [activePosition]);

  const { data: assetPrice } = useSignalerAssetPrice({
    strategyKey: signaler.key,
    assetName,
  });

  const effectivePrice =
    orderType === 'market'
      ? assetPrice === undefined
        ? 0
        : assetPrice
      : +price;

  const isValidP = useCallback(
    (p: number | string, type: 'TP' | 'SL') => {
      if (p === '') return false;
      const typeSign = type === 'TP' ? 1 : -1;
      const marketSign = market === 'long' ? 1 : -1;
      const sgn = typeSign * marketSign;
      return +p * sgn > effectivePrice * sgn;
    },
    [effectivePrice, market],
  );

  useEffect(() => {
    if (!assetPrice) return;

    setPrice(x => x || String(roundDown(assetPrice, 2)));
    setTP(x =>
      isValidP(x, 'TP')
        ? x
        : String(
            roundDown(effectivePrice * (market === 'long' ? 1.1 : 0.9), 2),
          ),
    );
    setSL(x =>
      isValidP(x, 'SL')
        ? x
        : String(
            roundDown(effectivePrice * (market === 'short' ? 1.1 : 0.9), 2),
          ),
    );
  }, [assetPrice, price, effectivePrice, isValidP, market]);

  // ======================================================================

  const [ModalConfirm, confirm] = useConfirm({
    title: 'Confirmation',
    icon: null,
    yesTitle: 'Yes',
    noTitle: 'No',
  });
  const { mutateAsync, isLoading: isSubmitting } = useFireSignalMutation();

  const isFireDisabled = (orderType === 'limit' && !price) || !tp || !sl;
  const fireHandler = async () => {
    if ((orderType === 'limit' && !price) || !tp || !sl) return;
    if (
      !(await confirm({
        message: 'Are you sure you want to fire this signal?',
      }))
    )
      return;

    try {
      await mutateAsync({
        signalerKey: signaler.key,
        action: 'open',
        pair: assetName,
        position: {
          type: signaler?.market_name === 'SPOT' ? 'long' : market,
          order_type: orderType,
          price:
            orderType === 'limit'
              ? {
                  value: Number.parseFloat(price),
                }
              : undefined,
          suggested_action_expires_at: parseDur(exp),
          order_expires_at: parseDur(orderExp),
        },
        take_profit: {
          price: { value: Number.parseFloat(tp) },
        },
        stop_loss: {
          price: { value: Number.parseFloat(sl) },
        },
      });
      notification.success({
        message: 'Signal fired successfully and will be visible in 90 seconds.',
      });
    } catch (error) {
      notification.error({ message: unwrapErrorMessage(error) });
    }
  };

  const closeHandler = async () => {
    if (!activePosition?.signal) return;
    if (
      !(await confirm({
        message: 'Are you sure you want to close this position?',
      }))
    )
      return;

    try {
      await mutateAsync({
        signalerKey: signaler.key,
        ...activePosition.signal,
        action: 'close',
      });
      notification.success({
        message:
          'Position closed successfully and will be visible in 90 seconds.',
      });
    } catch (error) {
      notification.error({ message: unwrapErrorMessage(error) });
    }
  };

  const isUpdateDisabled = !tp || !sl;
  const updateHandler = async () => {
    if (!activePosition?.signal) return;
    if (
      !(await confirm({
        message: 'Are you sure you want to update this signal?',
      }))
    )
      return;

    try {
      await mutateAsync({
        signalerKey: signaler.key,
        ...activePosition.signal,
        action: 'open',
        take_profit: {
          price: { value: Number.parseFloat(tp) },
        },
        stop_loss: {
          price: { value: Number.parseFloat(sl) },
        },
      });
      notification.success({ message: 'Position updated successfully.' });
    } catch (error) {
      notification.error({ message: unwrapErrorMessage(error) });
    }
  };

  return (
    <div className="flex basis-1/3 flex-col gap-4">
      {!isUpdate && (
        <>
          {signaler?.market_name === 'FUTURES' && (
            <MarketToggle value={market} onChange={setMarket} />
          )}
          <div className="flex items-end gap-2">
            <AmountInputBox
              label="Price"
              value={
                orderType === 'market'
                  ? assetPrice === undefined
                    ? '-'
                    : '~ ' + String(roundDown(assetPrice, 2))
                  : price
              }
              onChange={setPrice}
              suffix="USDT"
              className="grow"
              disabled={orderType === 'market'}
            />
            <OrderTypeToggle value={orderType} onChange={setOrderType} />
          </div>
        </>
      )}

      <AmountInputBox
        label="Take Profit"
        value={tp}
        onChange={setTP}
        suffix="USDT"
        disabled={!!activePosition}
        min={(market === 'long' && effectivePrice) || undefined}
        max={(market === 'short' && effectivePrice) || undefined}
      />
      <AmountInputBox
        label="Stop Loss"
        value={sl}
        onChange={setSL}
        suffix="USDT"
        min={Math.max(
          (market === 'long' && activePosition?.stop_loss) || 0,
          (market === 'short' && effectivePrice) || 0,
        )}
        max={Math.min(
          (market === 'short' && activePosition?.stop_loss) || 1e100,
          (market === 'long' && effectivePrice) || 1e100,
        )}
      />

      {!isUpdate && (
        <>
          <div className="flex items-end gap-2">
            <DurationInput
              label="Expiration Time"
              value={exp}
              onChange={setExp}
            />
            <DurationInput
              label="Order Expiration Time"
              value={orderExp}
              onChange={setOrderExp}
              disabled={orderType === 'market'}
            />
          </div>
        </>
      )}

      {isUpdate && (
        <Button
          variant="alternative"
          onClick={updateHandler}
          loading={isSubmitting}
          disabled={isUpdateDisabled}
        >
          Update Position
        </Button>
      )}

      <div className="border-b border-white/5" />

      {isUpdate ? (
        <Button
          variant="secondary-red"
          onClick={closeHandler}
          loading={isSubmitting}
        >
          Close
        </Button>
      ) : (
        <Button
          variant="green"
          onClick={fireHandler}
          loading={isSubmitting}
          disabled={isFireDisabled}
        >
          Fire Signal
        </Button>
      )}

      {ModalConfirm}
    </div>
  );
};

export default SignalForm;
