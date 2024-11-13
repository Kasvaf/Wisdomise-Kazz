import { notification } from 'antd';
import { useTranslation } from 'react-i18next';
import { useTonAddress } from '@tonconnect/ui-react';
import { useNavigate, useParams } from 'react-router-dom';
import { unwrapErrorMessage } from 'utils/error';
import useConfirm from 'shared/useConfirm';
import { useCoinOverview } from 'api';
import {
  useTraderFirePositionMutation,
  useTraderCancelPositionMutation,
  useTraderUpdatePositionMutation,
  type Position,
} from 'api/trader';
import { useTransferAssetsMutation } from 'api/ton';
import { type SignalFormState } from './useSignalFormStates';
import { parseDur } from './DurationInput';

interface Props {
  data: SignalFormState;
  assetName: string;
  activePosition?: Position;
}

const useActionHandlers = ({ data, assetName, activePosition }: Props) => {
  const { t } = useTranslation('builder');
  const { slug } = useParams<{ slug: string }>();
  if (!slug) throw new Error('unexpected');
  const navigate = useNavigate();

  const {
    price: [price],
    leverage: [leverage],
    amount: [amount],
    orderType: [orderType],
    exp: [exp],
    orderExp: [orderExp],
    remainingVolume,
    getTakeProfits,
    getStopLosses,
    getOpenOrders,
    reset,
  } = data;

  const { data: lastPrice } = useCoinOverview({ slug });
  const address = useTonAddress();
  const assetPrice = lastPrice?.data?.current_price;

  const { mutateAsync, isLoading: isSubmitting } =
    useTraderFirePositionMutation();

  const { mutateAsync: updateOrClose, isLoading: isUpdating } =
    useTraderUpdatePositionMutation();

  const { mutateAsync: cancelAsync } = useTraderCancelPositionMutation();

  const [ModalConfirm, confirm] = useConfirm({
    title: t('common:confirmation'),
    icon: null,
    yesTitle: t('common:actions.yes'),
    noTitle: t('common:actions.no'),
  });

  const transferAssetsHandler = useTransferAssetsMutation();
  const fireHandler = async () => {
    if ((orderType === 'limit' && !price) || !assetPrice || !address) return;

    try {
      const res = await mutateAsync({
        signal: {
          action: 'open',
          pair: assetName,
          leverage: { value: Number(leverage) || 1 },
          position: {
            type: 'long',
            order_expires_at: parseDur(orderExp),
            suggested_action_expires_at: parseDur(exp),
          },
          take_profit: getTakeProfits(),
          stop_loss: getStopLosses(),
          open_orders: getOpenOrders(0),
        },
        withdraw_address: address,
        quote: 'USDT',
        quote_amount: amount,
      });

      try {
        await transferAssetsHandler({
          recipientAddress: res.deposit_address,
          gasFee: res.gas_fee,
          amount,
        });
        navigate(`/trader-hot-coins/${slug}`);
      } catch {
        await cancelAsync(res.position_key);
        notification.error({ message: 'Transaction Canceled' });
      }
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
      await updateOrClose({
        position_key: activePosition.key,
        signal: {
          ...activePosition.signal,
          action: 'update',
          take_profit: getTakeProfits(),
          stop_loss: getStopLosses(),
          open_orders: getOpenOrders(
            assetPrice,
            activePosition.manager?.open_orders,
          ),
        },
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
      await updateOrClose({
        position_key: activePosition.key,
        signal: {
          ...activePosition.signal,
          action: 'close',
          position: activePosition.signal.position,
          stop_loss: { items: [] },
          take_profit: { items: [] },
          open_orders: { items: [] },
        },
      });
      reset();
      notification.success({
        message: t('signal-form.notif-success-close'),
      });
      navigate(`/trader-hot-coins/${slug}`);
    } catch (error) {
      notification.error({ message: unwrapErrorMessage(error) });
    }
  };

  return {
    isEnabled: !!assetPrice && Number(amount) > 0 && remainingVolume === 0,
    isSubmitting: isSubmitting || isUpdating,
    fireHandler,
    updateHandler,
    closeHandler,
    ModalConfirm,
  };
};

export default useActionHandlers;
