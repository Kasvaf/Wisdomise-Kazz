import { notification } from 'antd';
import { useTranslation } from 'react-i18next';
import {
  CHAIN,
  type SendTransactionRequest,
  useTonAddress,
  useTonConnectUI,
} from '@tonconnect/ui-react';
import { Address, beginCell } from '@ton/core';
import { type FullPosition, type SignalerData } from 'api/builder';
import { unwrapErrorMessage } from 'utils/error';
import useConfirm from 'shared/useConfirm';
import { parseDur } from 'modules/builder/signaler/PageSignalerDetails/TabTerminal/DurationInput';
import {
  useLastCandleQuery,
  useTraderFirePositionMutation,
  useTraderUpdatePositionMutation,
} from '../../../../../../trader';
import { type SignalFormState } from './useSignalFormStates';

interface Props {
  data: SignalFormState;
  signaler?: SignalerData;
  assetName: string;
  activePosition?: FullPosition;
}

const USDT_CONTRACT_ADDRESS = import.meta.env.USDT_CONTRACT_ADDRESS;

const useActionHandlers = ({ data, assetName, activePosition }: Props) => {
  const { t } = useTranslation('builder');
  const [tonConnectUI] = useTonConnectUI();

  const {
    price: [price],
    leverage: [leverage],
    amount: [amount],
    orderType: [orderType],
    market: [_market],
    exp: [exp],
    orderExp: [orderExp],
    getTakeProfits,
    getStopLosses,
    getOpenOrders,
    reset,
  } = data;

  const { data: lastCandle } = useLastCandleQuery();
  const address = useTonAddress();
  const assetPrice = lastCandle?.candle.close ?? 1;

  const { mutateAsync, isLoading: isSubmitting } =
    useTraderFirePositionMutation();

  const { mutateAsync: updateOrClose, isLoading: isUpdating } =
    useTraderUpdatePositionMutation();

  const [ModalConfirm, confirm] = useConfirm({
    title: t('common:confirmation'),
    icon: null,
    yesTitle: t('common:actions.yes'),
    noTitle: t('common:actions.no'),
  });

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
            // type: signaler?.market_name === 'SPOT' ? 'long' : market, // long
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
      transferTonHandler(res.deposit_address);
    } catch (error) {
      notification.error({ message: unwrapErrorMessage(error) });
    }
  };

  // function generatePayload(sendTo: string): string {
  //   const op = 0x5f_cc_3d_14; // transfer
  //   const quiryId = 0;
  //   const messageBody = beginCell()
  //     .storeUint(op, 32)
  //     .storeUint(quiryId, 64)
  //     .storeAddress(Address.parse(sendTo))
  //     .storeUint(0, 2)
  //     .storeInt(0, 1)
  //     .storeCoins(0)
  //     .endCell();
  //
  //   return Base64.encode(messageBody.toBoc());
  // }

  const createTransferPayload = (recipientAddress: string, amount: bigint) => {
    const op = 0x5f_cc_3d_14; // transfer
    const messageBody = beginCell()
      .storeUint(op, 32)
      .storeAddress(Address.parse(recipientAddress))
      .storeCoins(amount)
      .endCell()
      .toBoc()
      .toString('base64');

    return messageBody;
  };

  const transferUSDTHandler = (recipientAddress: string) => {
    const transaction: SendTransactionRequest = {
      validUntil: Date.now() + 5 * 60 * 1000, // 5 minutes
      network: CHAIN.TESTNET,
      messages: [
        {
          address: USDT_CONTRACT_ADDRESS,
          amount: '10000000', // This is the fee for interacting with the contract in nanotons
          payload: createTransferPayload(recipientAddress, BigInt(+amount)),
        },
      ],
    };

    void tonConnectUI.sendTransaction(transaction).then(data => {
      console.log(data);
      return null;
    });
  };

  const transferTonHandler = (recipientAddress: string) => {
    const transaction: SendTransactionRequest = {
      validUntil: Date.now() + 5 * 60 * 1000, // 5 minutes
      network: CHAIN.TESTNET,
      messages: [
        // {
        //   // The receiver's address.
        //   address: 'EQCKWpx7cNMpvmcN5ObM5lLUZHZRFKqYA4xmw9jOry0ZsF9M',
        //   // Amount to send in nanoTON. For example, 0.005 TON is 5000000 nanoTON.
        //   amount: '5000000',
        //   // (optional) State initialization in boc base64 format.
        //   stateInit:
        //     'te6cckEBBAEAOgACATQCAQAAART/APSkE/S88sgLAwBI0wHQ0wMBcbCRW+D6QDBwgBDIywVYzxYh+gLLagHPFsmAQPsAlxCarA==',
        //   // (optional) Payload in boc base64 format.
        //   payload: 'te6ccsEBAQEADAAMABQAAAAASGVsbG8hCaTc/g==',
        // },
        // {
        //   // The receiver's address.
        //   address: 'EQCKWpx7cNMpvmcN5ObM5lLUZHZRFKqYA4xmw9jOry0ZsF9M',
        //   // Amount to send in nanoTON. For example, 0.005 TON is 5000000 nanoTON.
        //   amount: '5000000',
        //   // (optional) State initialization in boc base64 format.
        //   stateInit:
        //     'te6cckEBBAEAOgACATQCAQAAART/APSkE/S88sgLAwBI0wHQ0wMBcbCRW+D6QDBwgBDIywVYzxYh+gLLagHPFsmAQPsAlxCarA==',
        //   // (optional) Payload in boc base64 format.
        //   payload: 'te6ccsEBAQEADAAMABQAAAAASGVsbG8hCaTc/g==',
        // },
        {
          address: 'EQAXFnF_CGPIXD5B56C-XPEyTAJiN4C1hI0-JjG5Suc6wzDA', // usdt
          amount: '5000000', // This is the fee for interacting with the contract in nanotons
          payload: createTransferPayload(recipientAddress, BigInt(+amount)),
        },
        {
          address: 'UQBKBwKt9IYW86bXbVETxk_Fl5GTVyFH0fF36L6sEUExeUXW',
          amount: '5000000', // This is the fee for interacting with the contract in nanotons
          payload: createTransferPayload(recipientAddress, BigInt(+amount)),
        },
      ],
    };

    void tonConnectUI.sendTransaction(transaction).then(data => {
      console.log(data);
      transferUSDTHandler(recipientAddress);
      return null;
    });
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
        position_key: 'activePosition.key',
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
        position_key: 'activePosition.key',
        signal: {
          ...activePosition.signal,
          action: 'close',
          position: activePosition.signal.position,
          stop_loss: { items: [] },
          take_profit: { items: [] },
          open_orders: getOpenOrders(
            assetPrice,
            activePosition.manager?.open_orders,
          ),
        },
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
    isSubmitting: isSubmitting || isUpdating,
    fireHandler,
    updateHandler,
    closeHandler,
    ModalConfirm,
  };
};

export default useActionHandlers;
