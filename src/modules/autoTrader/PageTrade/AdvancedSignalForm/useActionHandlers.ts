import { useState } from 'react';
import { notification } from 'antd';
import { useTranslation } from 'react-i18next';
import { TonConnectError, UserRejectsError } from '@tonconnect/ui-react';
import { useNavigate } from 'react-router-dom';
import { unwrapErrorMessage } from 'utils/error';
import useConfirm from 'shared/useConfirm';
import { useLastPriceQuery } from 'api';
import {
  useTraderFirePositionMutation,
  useTraderCancelPositionMutation,
  useTraderUpdatePositionMutation,
  type Position,
  type CreatePositionRequest,
} from 'api/trader';
import { useActiveWallet, useTransferAssetsMutation } from 'api/chains';
import { useActiveNetwork } from 'modules/base/active-network';
import { type SignalFormState } from './useSignalFormStates';
import useModalApproval from './useModalApproval';
import { parseDur } from './DurationInput';

interface Props {
  baseSlug: string;
  data: SignalFormState;
  activePosition?: Position;
}

const useActionHandlers = ({ baseSlug, data, activePosition }: Props) => {
  const { t } = useTranslation('builder');
  const navigate = useNavigate();
  const network = useActiveNetwork();

  const {
    leverage: [leverage],
    amount: [amount],
    quote: [quote],
    exp: [exp],
    orderExp: [orderExp],
    remainingVolume,
    remainingTpVolume,
    remainingSlVolume,
    getTakeProfits,
    getStopLosses,
    getOpenOrders,
    reset,
  } = data;

  const { data: assetPrice } = useLastPriceQuery({
    slug: baseSlug,
    quote,
    convertToUsd: true,
  });
  const { address } = useActiveWallet();

  const { mutateAsync, isPending: isSubmitting } =
    useTraderFirePositionMutation();

  const { mutateAsync: updateOrClose, isPending: isUpdating } =
    useTraderUpdatePositionMutation();

  const { mutateAsync: cancelAsync } = useTraderCancelPositionMutation();

  const [ModalConfirm, confirm] = useConfirm({
    title: t('common:confirmation'),
    icon: null,
    yesTitle: t('common:actions.yes'),
    noTitle: t('common:actions.no'),
  });

  const [isFiring, setIsFiring] = useState(false);
  const [ModalApproval, showModalApproval] = useModalApproval();
  const transferAssetsHandler = useTransferAssetsMutation(quote);
  const fireHandler = async () => {
    if (!assetPrice || !address || !network) return;

    const createData: CreatePositionRequest = {
      network,
      signal: {
        action: 'open',
        pair_slug: baseSlug + '/' + quote,
        leverage: { value: Number(leverage) || 1 },
        position: {
          type: 'long',
          order_expires_at: parseDur(orderExp),
          suggested_action_expires_at: parseDur(exp),
        },
        take_profit: getTakeProfits(),
        stop_loss: getStopLosses(),
        open_orders: getOpenOrders(assetPrice),
      },
      withdraw_address: address,
      quote_slug: quote,
      quote_amount: amount,
    } as const;

    if (!(await showModalApproval(data, createData))) return;

    try {
      const res = await mutateAsync(createData);

      try {
        setIsFiring(true);
        await transferAssetsHandler({
          recipientAddress: res.deposit_address,
          gasFee: res.gas_fee,
          amount,
        });
        navigate(`/trader/positions?slug=${baseSlug}`);
      } catch (error) {
        if (error instanceof TonConnectError) {
          if (error instanceof UserRejectsError) {
            notification.error({ message: 'Transaction Canceled' });
          } else {
            notification.error({ message: error.message });
          }
        }

        await cancelAsync({
          network,
          positionKey: res.position_key,
        });
      } finally {
        setIsFiring(false);
      }
    } catch (error) {
      notification.error({ message: unwrapErrorMessage(error) });
    }
  };

  const updateHandler = async () => {
    if (!activePosition?.signal || !assetPrice || !network) return;
    if (
      !(await confirm({
        message: t('signal-form.confirm-update'),
      }))
    )
      return;

    try {
      await updateOrClose({
        network,
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
    if (!activePosition?.signal || !assetPrice || !network) return;
    if (
      !(await confirm({
        message: t('signal-form.confirm-close'),
      }))
    )
      return;

    try {
      await updateOrClose({
        network,
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
      navigate(`/trader/positions?slug=${baseSlug}`);
    } catch (error) {
      notification.error({ message: unwrapErrorMessage(error) });
    }
  };

  return {
    isEnabled:
      !!network &&
      !!assetPrice &&
      Number(amount) > 0 &&
      remainingVolume === 0 &&
      remainingTpVolume >= 0 &&
      remainingSlVolume >= 0,
    isSubmitting: isSubmitting || isUpdating || isFiring,
    fireHandler,
    updateHandler,
    closeHandler,
    ModalConfirm,
    ModalApproval,
  };
};

export default useActionHandlers;
