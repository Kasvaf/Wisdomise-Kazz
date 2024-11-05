import { notification } from 'antd';
import { useTranslation } from 'react-i18next';
import {
  CHAIN,
  type SendTransactionRequest,
  useTonAddress,
  useTonConnectUI,
} from '@tonconnect/ui-react';
import { Address, beginCell, toNano } from '@ton/core';
import { useNavigate, useParams } from 'react-router-dom';
import { TonClient } from '@ton/ton';
import { type FullPosition, type SignalerData } from 'api/builder';
import { unwrapErrorMessage } from 'utils/error';
import useConfirm from 'shared/useConfirm';
import { useCoinOverview } from 'api';
import {
  useTraderFirePositionMutation,
  useTraderUpdatePositionMutation,
} from 'api/trader';
import { parseDur } from 'modules/builder/signaler/PageSignalerDetails/TabTerminal/DurationInput';
import { type SignalFormState } from './useSignalFormStates';

interface Props {
  data: SignalFormState;
  signaler?: SignalerData;
  assetName: string;
  activePosition?: FullPosition;
}

const useActionHandlers = ({ data, assetName, activePosition }: Props) => {
  const { t } = useTranslation('builder');
  const [tonConnectUI] = useTonConnectUI();
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

  const [ModalConfirm, confirm] = useConfirm({
    title: t('common:confirmation'),
    icon: null,
    yesTitle: t('common:actions.yes'),
    noTitle: t('common:actions.no'),
  });

  const getJettonWalletAddress = async () => {
    if (!address) return;

    const jettonMasterAddress = Address.parse(
      'EQCxE6mUtQJKFnGfaROTKOt1lZbDiiX1kCixRv7Nw2Id_sDs', // USDT
    );
    const ownerAddress = Address.parse(address);
    const client = new TonClient({
      endpoint: 'https://toncenter.com/api/v2/jsonRPC',
    });

    try {
      const { stack } = await client.callGetMethod(
        jettonMasterAddress,
        'get_wallet_address',
        [
          {
            type: 'slice',
            cell: beginCell().storeAddress(ownerAddress).endCell(),
          },
        ],
      );

      const jettonWalletAddress = stack.readAddress();
      return jettonWalletAddress.toString();
    } catch (error) {
      console.error('Error fetching jetton wallet address:', error);
    }
  };

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
      // await transferAssetsHandler(
      //   'kQBZ1f1PcDQl3d5S9hgLaSuXuKNI9fy3ErblFi3J4tROsx7_',
      //   '0.86',
      // );
      await transferAssetsHandler(res.deposit_address, res.gas_fee);
    } catch (error) {
      notification.error({ message: unwrapErrorMessage(error) });
    }
  };

  const transferAssetsHandler = async (
    recipientAddress: string,
    gasFee: string,
  ) => {
    const jettonWalletAddress = await getJettonWalletAddress();
    const transaction: SendTransactionRequest = {
      validUntil: Date.now() + 5 * 60 * 1000, // 5 minutes
      network: CHAIN.MAINNET,
      messages: [
        {
          address: recipientAddress,
          amount: toNano(gasFee).toString(),
          payload: beginCell()
            .storeUint(0, 32) // write 32 zero bits to indicate that a text comment will follow
            .storeStringTail('Gas fee') // write our text comment
            .endCell()
            .toBoc()
            .toString('base64'),
        },
        {
          address: jettonWalletAddress ?? '',
          amount: toNano('0.05').toString(),
          payload: beginCell()
            .storeUint(0xf_8a_7e_a5, 32) // jetton transfer op code
            .storeUint(0, 64) // query_id:uint64
            .storeCoins(toNano(amount)) // amount:(VarUInteger 16) -  Jetton amount for transfer (decimals = 6 - USDT, 9 - default). Function toNano use decimals = 9 (remember it)
            .storeAddress(Address.parse(recipientAddress)) // destination:MsgAddress
            .storeAddress(Address.parse(jettonWalletAddress ?? '')) // response_destination:MsgAddress
            .storeUint(0, 1) // custom_payload:(Maybe ^Cell)
            .storeCoins(toNano('0.05')) // forward_ton_amount:(VarUInteger 16) - if >0, will send notification message
            .storeUint(0, 1) // forward_payload:(Either Cell ^Cell)
            .endCell()
            .toBoc()
            .toString('base64'),
        },
      ],
    };

    void tonConnectUI
      .sendTransaction(transaction)
      .then(() => navigate(`/hot-coins/${slug}`));
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
