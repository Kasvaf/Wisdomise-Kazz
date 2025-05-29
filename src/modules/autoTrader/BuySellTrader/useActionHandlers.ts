import { notification } from 'antd';
import { TonConnectError, UserRejectsError } from '@tonconnect/ui-react';
import { v4 } from 'uuid';
import {
  useTraderCancelPositionMutation,
  useTraderFirePositionMutation,
  type CreatePositionRequest,
} from 'api';
import {
  useActiveWallet,
  useMarketSwap,
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

    dir,

    isMarketPrice,
    firing: [firing, setFiring],
    confirming: [, setConfirming],
  } = state;
  const { address, isCustodial } = useActiveWallet();

  const awaitConfirm = (cb: () => Promise<boolean>, message: string) => {
    setConfirming(true);
    void cb()
      .then(res => {
        if (res) notification.success({ message });
        return res;
      })
      .finally(() => setConfirming(false));
  };

  const { mutateAsync: cancelAsync } = useTraderCancelPositionMutation();
  const { mutateAsync, isPending: isSubmitting } =
    useTraderFirePositionMutation();

  const transferAssetsHandler = useTransferAssetsMutation(from.slug);
  const marketSwapHandler = useMarketSwap();

  const [ModalApproval, showModalApproval] = useModalApproval();
  const firePosition = async () => {
    if (!base.slug || !quote.slug || !address) return;

    // direct swap
    if (network === 'solana' && isMarketPrice && !isCustodial) {
      setFiring(true);
      try {
        const swapData = {
          pairSlug: base.slug + '/' + quote.slug,
          side: dir === 'buy' ? 'LONG' : 'SHORT',
          amount: from.amount,
        } as const;

        if (
          !(await showModalApproval(state, undefined, {
            ...swapData,
            network: 'solana',
          }))
        )
          return;

        awaitConfirm(
          await marketSwapHandler(swapData),
          'Swap completed successfully',
        );
      } catch (error) {
        notification.error({ message: unwrapErrorMessage(error) });
      } finally {
        setFiring(false);
      }
      return;
    }

    const createData: CreatePositionRequest = {
      network,
      mode: dir === 'buy' ? 'buy_and_hold' : 'sell_and_hold',
      // one of following:
      ...(dir === 'buy'
        ? { quote_amount: quote.amount }
        : { base_amount: base.amount }),

      signal: {
        action: 'open',
        pair_slug: base.slug + '/' + quote.slug,
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
                    price_exact: isMarketPrice
                      ? 0
                      : +quote.amount / +base.amount, // happens when price >= 123
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
        awaitConfirm(
          await transferAssetsHandler({
            positionKey: res.position_key,
            recipientAddress: res.deposit_address,
            gasFee: res.gas_fee,
            amount: from.amount,
          }),
          'Position created successfully',
        );
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
      setFiring(false);
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
