import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { notification } from 'antd';
import { TonConnectError, UserRejectsError } from '@tonconnect/ui-react';
import {
  useTraderCancelPositionMutation,
  useTraderFirePositionMutation,
  type CreatePositionRequest,
} from 'api';
import {
  type AutoTraderSupportedQuotes,
  useActiveWallet,
  useTransferAssetsMutation,
} from 'api/chains';
import { unwrapErrorMessage } from 'utils/error';
import { parseDur } from '../PageTrade/AdvancedSignalForm/DurationInput';
import { type SwapState } from './useSwapState';
import useModalApproval from './useModalApproval';

const useActionHandlers = (state: SwapState) => {
  const {
    selectedNet: network,
    base,
    quote,
    from,

    quoteAmount,
    baseAmount,

    dir,

    // isMarketPrice,
    // setIsMarketPrice,
    // toPrice,
    // setToPrice,
  } = state;
  const { address } = useActiveWallet();
  const navigate = useNavigate();

  const { mutateAsync: cancelAsync } = useTraderCancelPositionMutation();
  const { mutateAsync, isPending: isSubmitting } =
    useTraderFirePositionMutation();
  const [isFiring, setIsFiring] = useState(false);

  const transferAssetsHandler = useTransferAssetsMutation(
    from.coin as AutoTraderSupportedQuotes,
    // TODO: this function doesn't support base slugs yet
  );

  const [ModalApproval, showModalApproval] = useModalApproval();
  const firePosition = async () => {
    if (!base || !quote || !address) return;

    const createData: CreatePositionRequest = {
      network,
      mode: dir === 'buy' ? 'BUY_AND_HOLD' : 'SELL_AND_HOLD',
      signal: {
        action: 'open',
        pair_slug: base + '/' + quote,
        leverage: { value: 1 },
        position: {
          type: 'long',
          order_expires_at: parseDur('1h'),
          suggested_action_expires_at: parseDur('1h'),
        },
        take_profit: { items: [] },
        stop_loss: { items: [] },
        open_orders: { items: [] },
      },
      withdraw_address: address,
      quote_slug: quote,
      quote_amount: quoteAmount,
      base_slug: base,
      base_amount: baseAmount,
    } as const;
    if (!(await showModalApproval(state, createData))) return;

    try {
      const res = await mutateAsync(createData);

      try {
        setIsFiring(true);
        await transferAssetsHandler({
          recipientAddress: res.deposit_address,
          gasFee: res.gas_fee,
          amount: from.amount,
        });
        navigate(`/trader/positions?slug=${base}`);
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

  return {
    isEnabled: !!network && !!base && !!quote && Number(from.amount) > 0,
    isSubmitting: isFiring || isSubmitting,
    firePosition,
    ModalApproval,
  };
};

export default useActionHandlers;
