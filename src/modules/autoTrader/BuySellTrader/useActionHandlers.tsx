import { notification } from 'antd';
import { useSwap } from 'api/chains';
import { useActiveWallet } from 'api/chains/wallet';
import { type CreateOrderRequest, useOrderMutation } from 'api/order';
import { slugToTokenAddress } from 'api/token-info';
import { useUserSettings } from 'modules/base/auth/UserSettingsProvider';
import { useChartConvertToUSD } from 'shared/AdvancedChart/chartSettings';
import Spin from 'shared/v1-components/Spin';
import type { SwapState } from './useSwapState';

const useActionHandlers = (state: SwapState) => {
  const {
    selectedNet: network,
    base,
    quote,
    from,

    dir,

    isMarketPrice,
    firing: [firing, setFiring],
    percentage,
  } = state;
  const { address, isCustodial } = useActiveWallet();
  const { getActivePreset } = useUserSettings();

  // const awaitConfirm = (cb: () => Promise<boolean>, message: string) => {
  //   setConfirming(true);
  //   void cb()
  //     .then(res => {
  //       if (res) notification.success({ message });
  //       return res;
  //     })
  //     .finally(() => setConfirming(false));
  // };

  // const { mutateAsync: cancelAsync } = useTraderCancelPositionMutation();
  // const { mutateAsync, isPending: isSubmitting } =
  //   useTraderFirePositionMutation();
  const { mutateAsync: createOrder } = useOrderMutation();
  const [convertToUSD] = useChartConvertToUSD();

  // const transferAssetsHandler = useTransferAssetsMutation(from.slug);
  const swapAsync = useSwap({
    source: 'terminal',
    slug: base.slug,
    quote: quote.slug,
  });

  const firePosition = async () => {
    if (!base.slug || !quote.slug || !address) return;

    const preset = getActivePreset('terminal');

    // swap
    if (network === 'solana' && isMarketPrice) {
      setFiring(true);
      try {
        await swapAsync(dir === 'buy' ? 'LONG' : 'SHORT', from.amount);
      } finally {
        setFiring(false);
      }
      return;
    }

    if (!isCustodial) {
      notification.error({
        message: 'Switch to custodial wallet to create limit order',
      });
      return;
    }

    // limit order
    const notificationKey = Date.now();
    notification.open({
      key: notificationKey,
      message: <NotificationContent />,
      duration: 30_000,
    });
    const createData: CreateOrderRequest = {
      network_slug: 'solana',
      base_address: slugToTokenAddress(base.slug),
      quote_address: slugToTokenAddress(quote.slug),
      type:
        dir === 'buy'
          ? percentage > 0
            ? 'BUY_BELOW'
            : 'BUY_ABOVE'
          : percentage > 0
            ? 'SELL_BELOW'
            : 'SELL_ABOVE',
      amount: dir === 'buy' ? quote.amount : base.amount,
      wallet_address: address,
      price: String(base.finalPrice),
      price_in_usd: convertToUSD,
      slippage: preset[dir].slippage,
      priority_fee: preset[dir].sol_priority_fee,
    };
    createOrder(createData).then(() => {
      notification.success({
        key: notificationKey,
        message: 'Limit Order Placed!',
      });
      return;
    });

    // const createData: CreatePositionRequest = {
    //   network,
    //   mode: dir === 'buy' ? 'buy_and_hold' : 'sell_and_hold',
    //   // one of following:
    //   ...(dir === 'buy'
    //     ? { quote_amount: quote.amount }
    //     : { base_amount: base.amount }),
    //
    //   signal: {
    //     action: 'open',
    //     pair_slug: `${base.slug}/${quote.slug}`,
    //     leverage: { value: 1 },
    //     position: {
    //       type: 'long',
    //       order_expires_at: parseDur('1h'),
    //       suggested_action_expires_at: parseDur('1h'),
    //     },
    //     take_profit: {
    //       items:
    //         dir === 'sell'
    //           ? [
    //               {
    //                 // sell order
    //                 key: v4(),
    //                 amount_ratio: 1, // always 1
    //                 price_exact: isMarketPrice ? 0 : base.finalPrice, // happens when price >= 123
    //               },
    //             ]
    //           : [], // buy = hold -> no take-profit
    //     },
    //     stop_loss: { items: [] },
    //     open_orders: {
    //       items: [
    //         dir === 'buy'
    //           ? {
    //               key: v4(),
    //               condition: isMarketPrice
    //                 ? { type: 'true' }
    //                 : {
    //                     type: 'compare',
    //                     left: 'price',
    //                     op: '<=',
    //                     right: base.finalPrice,
    //                   },
    //               amount: 1, // buy all at once
    //             }
    //           : {
    //               // sell
    //               key: v4(),
    //               condition: { type: 'true' },
    //               amount: 0, // no open
    //             },
    //       ],
    //     },
    //   },
    //   withdraw_address: address,
    //   buy_slippage: preset.buy.slippage,
    //   sell_slippage: preset.sell.slippage,
    //   buy_priority_fee: preset.buy.sol_priority_fee,
    //   sell_priority_fee: preset.sell.sol_priority_fee,
    // } as const;
    // try {
    //   setFiring(true);
    //   const res = await mutateAsync(createData);
    //
    //   try {
    //     awaitConfirm(
    //       isCustodial
    //         ? () => Promise.resolve(true)
    //         : await transferAssetsHandler({
    //             positionKey: res.position_key,
    //             recipientAddress: res.deposit_address,
    //             gasFee: res.gas_fee,
    //             amount: from.amount,
    //           }),
    //       'Position created successfully',
    //     );
    //   } catch (error) {
    //     if (error instanceof TonConnectError) {
    //       if (error instanceof UserRejectsError) {
    //         notification.error({ message: 'Transaction Canceled' });
    //       } else {
    //         notification.error({ message: error.message });
    //       }
    //     }
    //
    //     await cancelAsync({
    //       network,
    //       positionKey: res.position_key,
    //     });
    //   }
    // } catch (error) {
    //   notification.error({ message: unwrapErrorMessage(error) });
    // } finally {
    //   setFiring(false);
    // }
  };

  return {
    isEnabled: !!network && !!base && !!quote && Number(from.amount) > 0,
    isSubmitting: firing,
    firePosition,
  };
};

const NotificationContent = () => {
  return (
    <div className="flex items-center gap-2">
      <Spin /> Creating Limit Order...
    </div>
  );
};

export default useActionHandlers;
