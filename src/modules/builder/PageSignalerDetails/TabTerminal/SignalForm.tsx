import { useState, useEffect } from 'react';
import { notification } from 'antd';
import {
  type SignalerData,
  type FullPosition,
  useCreateSignalMutation,
} from 'api/builder';
import { unwrapErrorMessage } from 'utils/error';
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
  const [orderType, setOrderType] = useState<'limit' | 'market'>('limit');
  const [price, setPrice] = useState('');
  const [tp, setTP] = useState('');
  const [sl, setSL] = useState('');
  const [exp, setExp] = useState('1h');
  const [orderExp, setOrderExp] = useState('1h');

  useEffect(() => {
    if (activePosition) {
      setTP(String(activePosition.take_profit));
      setSL(String(activePosition.stop_loss));
    }
  }, [activePosition]);

  const { mutateAsync, isLoading: isSubmitting } = useCreateSignalMutation();

  const isFireDisabled = (orderType === 'limit' && !price) || !tp || !sl;
  const fireHandler = async () => {
    if ((orderType === 'limit' && !price) || !tp || !sl) return;
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
      notification.success({ message: 'Signal fired successfully.' });
    } catch (error) {
      notification.error({ message: unwrapErrorMessage(error) });
    }
  };

  const closeHandler = async () => {
    if (!activePosition?.signal) return;
    try {
      await mutateAsync({
        signalerKey: signaler.key,
        ...activePosition.signal,
        action: 'close',
      });
      notification.success({ message: 'Position closed successfully.' });
    } catch (error) {
      notification.error({ message: unwrapErrorMessage(error) });
    }
  };

  const isUpdateDisabled = !tp || !sl;
  const updateHandler = async () => {
    if (!activePosition?.signal) return;
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
              value={orderType === 'market' ? '-' : price}
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
      />
      <AmountInputBox
        label="Stop Loss"
        value={sl}
        onChange={setSL}
        suffix="USDT"
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
    </div>
  );
};

export default SignalForm;
