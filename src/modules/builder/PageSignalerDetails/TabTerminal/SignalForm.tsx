import { useState, useEffect, useCallback } from 'react';
import { notification } from 'antd';
import { useTranslation } from 'react-i18next';
import { v4 } from 'uuid';
import {
  type SignalerData,
  type FullPosition,
  useSignalerAssetPrice,
  useFireSignalMutation,
} from 'api/builder';
import { roundDown } from 'utils/numbers';
import { unwrapErrorMessage } from 'utils/error';
import AmountInputBox from 'shared/AmountInputBox';
import useConfirm from 'shared/useConfirm';
import InfoButton from 'shared/InfoButton';
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
  const { t } = useTranslation('builder');
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
    if (!assetPrice || activePosition) return;

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
  }, [assetPrice, price, effectivePrice, isValidP, market, activePosition]);

  // ======================================================================

  const [ModalConfirm, confirm] = useConfirm({
    title: t('common:confirmation'),
    icon: null,
    yesTitle: t('common:actions.yes'),
    noTitle: t('common:actions.no'),
  });
  const { mutateAsync, isLoading: isSubmitting } = useFireSignalMutation();

  const isFireDisabled = (orderType === 'limit' && !price) || !tp || !sl;
  const fireHandler = async () => {
    if ((orderType === 'limit' && !price) || !tp || !sl) return;
    if (
      !(await confirm({
        message: t('signal-form.confirm-fire'),
      }))
    )
      return;

    try {
      await mutateAsync({
        signalerKey: signaler.key,
        action: 'open',
        pair: assetName,
        leverage: { value: 1 },
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
          items: [
            {
              key: v4(),
              amount_ratio: 1,
              price_exact: Number.parseFloat(tp),
            },
          ],
        },
        stop_loss: {
          items: [
            {
              key: v4(),
              amount_ratio: 1,
              price_exact: Number.parseFloat(sl),
            },
          ],
        },
      });
      notification.success({
        message: t('signal-form.notif-success-fire'),
      });
    } catch (error) {
      notification.error({ message: unwrapErrorMessage(error) });
    }
  };

  const closeHandler = async () => {
    if (!activePosition?.signal) return;
    if (
      !(await confirm({
        message: t('signal-form.confirm-close'),
      }))
    )
      return;

    try {
      await mutateAsync({
        signalerKey: signaler.key,
        ...activePosition.signal,
        action: 'close',
        position: {
          ...activePosition.signal.position,
          order_type: 'market',
          price: undefined,
        },
        stop_loss: { items: [] },
        take_profit: { items: [] },
      });
      notification.success({
        message: t('signal-form.notif-success-close'),
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
        message: t('signal-form.confirm-update'),
      }))
    )
      return;

    try {
      await mutateAsync({
        signalerKey: signaler.key,
        ...activePosition.signal,
        action: 'update',
        take_profit: {
          items: [
            {
              key: v4(),
              amount_ratio: 1,
              price_exact: Number.parseFloat(tp),
            },
          ],
        },
        stop_loss: {
          items: [
            {
              key: v4(),
              amount_ratio: 1,
              price_exact: Number.parseFloat(sl),
            },
          ],
        },
      });
      notification.success({ message: t('signal-form.notif-success-update') });
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
              label={t('signal-form.price')}
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
        label={t('signal-form.take-profit')}
        value={tp}
        onChange={setTP}
        suffix="USDT"
      />
      <AmountInputBox
        label={t('signal-form.stop-loss')}
        value={sl}
        onChange={setSL}
        suffix="USDT"
      />

      {!isUpdate && (
        <>
          <div className="flex items-end gap-2">
            <DurationInput
              label={
                <div className="flex items-center">
                  {t('signal-form.expiration-time.title')}
                  <InfoButton
                    size={10}
                    className="ml-1 !opacity-50"
                    title={t('signal-form.expiration-time.info-title')}
                    text={t('signal-form.expiration-time.info-text')}
                  />
                </div>
              }
              value={exp}
              onChange={setExp}
            />
            <DurationInput
              label={
                <div className="flex items-center">
                  {t('signal-form.order-expiration-time.title')}
                  <InfoButton
                    size={10}
                    className="ml-1 !opacity-50"
                    title={t('signal-form.order-expiration-time.info-title')}
                    text={t('signal-form.order-expiration-time.info-text')}
                  />
                </div>
              }
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
          {t('signal-form.btn-update')}
        </Button>
      )}

      <div className="border-b border-white/5" />

      {isUpdate ? (
        <Button
          variant="secondary-red"
          onClick={closeHandler}
          loading={isSubmitting}
        >
          {t('signal-form.btn-close')}
        </Button>
      ) : (
        <Button
          variant="green"
          onClick={fireHandler}
          loading={isSubmitting}
          disabled={isFireDisabled}
        >
          {t('signal-form.btn-fire-signal')}
        </Button>
      )}

      {ModalConfirm}
    </div>
  );
};

export default SignalForm;
