import { useNavigate } from 'react-router-dom';
import { notification } from 'antd';
import { TonConnectError, UserRejectsError } from '@tonconnect/ui-react';
import { v4 } from 'uuid';
import {
  useTraderCancelPositionMutation,
  useTraderFirePositionMutation,
  type CreatePositionRequest,
} from 'api';
import { useActiveWallet, useTransferAssetsMutation } from 'api/chains';
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

    isMarketPrice,
    firing: [firing, setFiring],
    confirming: [, setConfirming],
  } = state;
  const { address } = useActiveWallet();
  const navigate = useNavigate();

  const { mutateAsync: cancelAsync } = useTraderCancelPositionMutation();
  const { mutateAsync, isPending: isSubmitting } =
    useTraderFirePositionMutation();

  const transferAssetsHandler = useTransferAssetsMutation(from.coin);

  const [ModalApproval, showModalApproval] = useModalApproval();
  const firePosition = async () => {
    if (!base || !quote || !address) return;

    const createData: CreatePositionRequest = {
      network,
      mode: dir === 'buy' ? 'buy_and_hold' : 'sell_and_hold',
      // one of following:
      ...(dir === 'buy'
        ? { quote_amount: quoteAmount }
        : { base_amount: baseAmount }),

      signal: {
        action: 'open',
        pair_slug: base + '/' + quote,
        leverage: { value: 1 },
        position: {
          type: 'long',
          order_expires_at: parseDur('1h'),
          suggested_action_expires_at: parseDur('1h'),
        },
        take_profit: {
          items:
            dir === 'sell'
              ? [
                  {
                    // sell order
                    key: v4(),
                    amount_ratio: 1, // always 1
                    price_exact: isMarketPrice ? 0 : +quoteAmount / +baseAmount, // happens when price >= 123
                  },
                ]
              : [], // buy = hold -> no take-profit
        },
        stop_loss: { items: [] },
        open_orders: {
          items: [
            dir === 'buy'
              ? {
                  key: v4(),
                  condition: isMarketPrice
                    ? { type: 'true' }
                    : {
                        type: 'compare',
                        left: 'price',
                        op: '<=',
                        right: 100,
                      },
                  amount: 1, // buy all at once
                }
              : {
                  // sell
                  key: v4(),
                  condition: { type: 'true' },
                  amount: 0, // no open
                },
          ],
        },
      },
      withdraw_address: address,
    } as const;
    if (!(await showModalApproval(state, createData))) return;

    try {
      setFiring(true);
      const res = await mutateAsync(createData);

      try {
        const awaitConfirm = await transferAssetsHandler({
          recipientAddress: res.deposit_address,
          gasFee: res.gas_fee,
          amount: from.amount,
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
          .finally(() => setConfirming(false));

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
        setFiring(false);
      }
    } catch (error) {
      notification.error({ message: unwrapErrorMessage(error) });
    }
  };

  return {
    isEnabled: !!network && !!base && !!quote && Number(from.amount) > 0,
    isSubmitting: firing || isSubmitting,
    firePosition,
    ModalApproval,
  };
};

export default useActionHandlers;
