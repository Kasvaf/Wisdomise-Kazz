import {
  CHAIN,
  useTonAddress,
  useTonConnectUI,
  type SendTransactionRequest,
} from '@tonconnect/ui-react';
import { Address, beginCell, toNano, TonClient } from '@ton/ton';
import { useQuery } from '@tanstack/react-query';
import { isProduction } from 'utils/version';

const TONCENTER_BASE_URL = String(import.meta.env.VITE_TONCENTER_BASE_URL);
export const USDT_DECIMAL = Number(import.meta.env.VITE_USDT_DECIMAL);
export const USDT_CONTRACT_ADDRESS = String(
  import.meta.env.VITE_USDT_CONTRACT_ADDRESS,
);

const useJettonWalletAddress = () => {
  const address = useTonAddress();

  return useQuery(
    ['jetton-wallet-address', address],
    async () => {
      if (!address) return;

      const jettonMasterAddress = Address.parse(USDT_CONTRACT_ADDRESS);
      const ownerAddress = Address.parse(address);
      const client = new TonClient({
        endpoint: `${TONCENTER_BASE_URL}/api/v2/jsonRPC`,
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
    },
    {
      staleTime: Number.POSITIVE_INFINITY,
      enabled: !!address,
    },
  );
};

export const useTransferAssetsMutation = () => {
  const address = useTonAddress();
  const [tonConnectUI] = useTonConnectUI();
  const { data: jettonWalletAddress } = useJettonWalletAddress();

  return async ({
    recipientAddress,
    amount,
    gasFee,
  }: {
    recipientAddress: string;
    amount: number | string;
    gasFee: string;
  }) => {
    const transaction: SendTransactionRequest = {
      validUntil: Date.now() + 10 * 60 * 1000,
      network: isProduction ? CHAIN.MAINNET : CHAIN.TESTNET,
      messages: [
        {
          address: Address.parse(recipientAddress).toString({
            bounceable: false,
            testOnly: !isProduction,
          }),
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
            .storeCoins(+amount * 10 ** USDT_DECIMAL) // amount:(VarUInteger 16) -  Jetton amount for transfer (decimals = 6 - USDT, 9 - default). Function toNano use decimals = 9 (remember it)
            .storeAddress(Address.parse(recipientAddress)) // destination:MsgAddress
            .storeAddress(Address.parse(address)) // response_destination:MsgAddress
            .storeUint(0, 1) // custom_payload:(Maybe ^Cell)
            .storeCoins(1) // forward_ton_amount:(VarUInteger 16) - if >0, will send notification message
            .storeUint(0, 1) // forward_payload:(Either Cell ^Cell)
            .endCell()
            .toBoc()
            .toString('base64'),
        },
      ],
    };

    await tonConnectUI.sendTransaction(transaction);
  };
};
