import { notification } from 'antd';
import { useTranslation } from 'react-i18next';
import {
  type FullPosition,
  type SignalerData,
  useFireSignalMutation,
  useSignalerAssetPrice,
} from 'api/builder';
import { unwrapErrorMessage } from 'utils/error';
import useConfirm from 'shared/useConfirm';
import { parseDur } from '../DurationInput';
import { type SignalFormState } from './useSignalFormStates';

interface Props {
  data: SignalFormState;
  signaler: SignalerData;
  assetName: string;
  activePosition?: FullPosition;
}

const useActionHandlers = ({
  data,
  signaler,
  assetName,
  activePosition,
}: Props) => {
  const { t } = useTranslation('builder');

  const {
    price: [price],
    orderType: [orderType],
    market: [market],
    exp: [exp],
    orderExp: [orderExp],
    getTakeProfits,
    getStopLosses,
    getOpenOrders,
    reset,
  } = data;

  const { data: assetPrice } = useSignalerAssetPrice({
    strategyKey: signaler.key,
    assetName,
  });

  const { mutateAsync, isLoading: isSubmitting } = useFireSignalMutation();

  const [ModalConfirm, confirm] = useConfirm({
    title: t('common:confirmation'),
    icon: null,
    yesTitle: t('common:actions.yes'),
    noTitle: t('common:actions.no'),
  });

  const fireHandler = async () => {
    if ((orderType === 'limit' && !price) || !assetPrice) return;
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
          order_expires_at: parseDur(orderExp),
          suggested_action_expires_at: parseDur(exp),
        },
        take_profit: getTakeProfits(),
        stop_loss: getStopLosses(),
        open_orders: getOpenOrders(assetPrice),
      });
      notification.success({
        message: t('signal-form.notif-success-fire'),
      });
    } catch (error) {
      notification.error({ message: unwrapErrorMessage(error) });
    }
  };

  const updateHandler = async () => {
    if (!activePosition?.signal || !assetPrice) return;
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
        take_profit: getTakeProfits(),
        stop_loss: getStopLosses(),
        open_orders: getOpenOrders(
          assetPrice,
          activePosition.manager?.open_orders,
        ),
      });
      notification.success({ message: t('signal-form.notif-success-update') });
    } catch (error) {
      notification.error({ message: unwrapErrorMessage(error) });
    }
  };

  const closeHandler = async () => {
    if (!activePosition?.signal || !assetPrice) return;
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
        position: activePosition.signal.position,
        stop_loss: { items: [] },
        take_profit: { items: [] },
        open_orders: getOpenOrders(
          assetPrice,
          activePosition.manager?.open_orders,
        ),
      });
      reset();
      notification.success({
        message: t('signal-form.notif-success-close'),
      });
    } catch (error) {
      notification.error({ message: unwrapErrorMessage(error) });
    }
  };

  return {
    isEnabled: !!assetPrice,
    isSubmitting,
    fireHandler,
    updateHandler,
    closeHandler,
    ModalConfirm,
  };
};

export default useActionHandlers;
