import { TonConnectError, UserRejectsError } from '@tonconnect/ui-react';
import { notification } from 'antd';
import { useLastPriceQuery } from 'api';
import { useTransferAssetsMutation } from 'api/chains';
import { useActiveWallet } from 'api/chains/wallet';
import {
  type CreatePositionRequest,
  type Position,
  useTraderCancelPositionMutation,
  useTraderFirePositionMutation,
  useTraderUpdatePositionMutation,
} from 'api/trader';
import { useActiveNetwork } from 'modules/base/active-network';
import { useUserSettings } from 'modules/base/auth/UserSettingsProvider';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import useConfirm from 'shared/useConfirm';
import { unwrapErrorMessage } from 'utils/error';
import useIsMobile from 'utils/useIsMobile';
import { parseDur } from './parseDur';
import useModalApproval from './useModalApproval';
import type { SignalFormState } from './useSignalFormStates';

interface Props {
  baseSlug: string;
  data: SignalFormState;
  activePosition?: Position;
}

const useActionHandlers = ({ baseSlug, data, activePosition }: Props) => {
  const { t } = useTranslation('builder');
  const isMobile = useIsMobile();
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
    confirming: [, setConfirming],
    firing: [isFiring, setIsFiring],
  } = data;

  const { data: assetPrice } = useLastPriceQuery({
    slug: baseSlug,
    quote,
    convertToUsd: true,
  });
  const { address, isCustodial } = useActiveWallet();
  const { getActivePreset } = useUserSettings();

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

  const [ModalApproval, showModalApproval] = useModalApproval();
  const transferAssetsHandler = useTransferAssetsMutation(quote);
  const fireHandler = async () => {
    if (!assetPrice || !address || !network) return;

    const preset = getActivePreset('terminal');
    const createData: CreatePositionRequest = {
      network,
      signal: {
        action: 'open',
        pair_slug: `${baseSlug}/${quote}`,
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
      buy_slippage: preset.buy.slippage,
      sell_slippage: preset.sell.slippage,
      buy_priority_fee: preset.buy.sol_priority_fee,
      sell_priority_fee: preset.buy.sol_priority_fee,
    } as const;

    if (!(await showModalApproval(data, createData))) return;
    try {
      setIsFiring(true);
      const res = await mutateAsync(createData);

      try {
        const awaitConfirm = isCustodial
          ? () => Promise.resolve(true)
          : await transferAssetsHandler({
              positionKey: res.position_key,
              recipientAddress: res.deposit_address,
              gasFee: res.gas_fee,
              amount,
            });

        setConfirming(true);
        void awaitConfirm()
          .then(res => {
            if (res) {
              notification.success({
                message: 'Position created successfully',
              });
            }
            return res;
          })
          .finally(() => {
            setConfirming(false);
            if (isMobile) {
              navigate(`/positions/${baseSlug}`);
            }
          });
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
      }
    } catch (error) {
      notification.error({ message: unwrapErrorMessage(error) });
    } finally {
      setIsFiring(false);
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
      navigate(`/positions/${baseSlug}`);
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
