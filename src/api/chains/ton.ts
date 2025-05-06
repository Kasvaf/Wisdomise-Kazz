import {
  CHAIN,
  useTonAddress,
  useTonConnectModal,
  useTonConnectUI,
  type SendTransactionRequest,
} from '@tonconnect/ui-react';
import { Address, beginCell, TonClient } from '@ton/ton';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { ofetch } from 'ofetch';
import { isProduction } from 'utils/version';
import { useUserStorage } from 'api/userStorage';
import { fromBigMoney, toBigMoney } from 'utils/money';
import { gtag } from 'config/gtag';
import { useSymbolInfo } from 'api/symbol';
import { usePromiseOfEffect } from './utils';

const tonClient = new TonClient({
  endpoint: `${String(import.meta.env.VITE_TONCENTER_BASE_URL)}/api/v2/jsonRPC`,
});

export const WSDM_CONTRACT_ADDRESS = String(
  import.meta.env.VITE_WSDM_CONTRACT_ADDRESS,
);

export type AutoTraderTonSupportedQuotes = 'tether' | 'the-open-network';

const TON_API = 'https://tonapi.io/v2/jettons';

const useJettonWalletAddress = (slug?: string) => {
  const address = useTonAddress();
  const isNative = slug === 'the-open-network';
  const { data } = useSymbolInfo(slug);
  const netInfo = data?.networks.find(
    x => x.network.slug === 'the-open-network',
  );

  return useQuery({
    queryKey: ['jetton-wallet-address', address, slug],
    queryFn: async () => {
      if (isNative) {
        return { decimals: 9, walletAddress: '' };
      }

      if (!address || !slug || !netInfo) return;

      const jettonMasterAddress = Address.parse(netInfo.contract_address);
      const ownerAddress = Address.parse(address);

      try {
        const [decimals, walletAddress] = await Promise.all([
          netInfo.decimals
            ? Promise.resolve(netInfo.decimals)
            : ofetch(`${TON_API}/${netInfo.contract_address}`).then(
                data => data.metadata.decimals,
              ),

          tonClient
            .runMethod(jettonMasterAddress, 'get_wallet_address', [
              {
                type: 'slice',
                cell: beginCell().storeAddress(ownerAddress).endCell(),
              },
            ])
            .then(({ stack }) => stack.readAddress().toString()),
        ]);

        return { decimals, walletAddress };
      } catch (error) {
        console.error('Error fetching jetton wallet address:', error);
      }
    },
    staleTime: Number.POSITIVE_INFINITY,
    enabled: isNative || (!!address && !!netInfo),
  });
};

export const useAccountJettonBalance = (slug?: string) => {
  const address = useTonAddress();
  const { data: { walletAddress, decimals } = {}, isLoading: jettonIsLoading } =
    useJettonWalletAddress(slug);
  const addr = slug === 'the-open-network' ? address : walletAddress;

  const query = useQuery({
    queryKey: ['accountJettonBalance', slug, addr],
    queryFn: async () => {
      if (!addr || !slug || !decimals) return null;
      const parsedAddress = Address.parse(addr);

      let balance: bigint | undefined;
      if (slug === 'the-open-network') {
        balance = await tonClient.getBalance(parsedAddress);
      } else {
        const { stack, exit_code: errorCode } =
          await tonClient.runMethodWithError(parsedAddress, 'get_wallet_data');

        if (errorCode === -13) return 0;
        else if (errorCode) {
          throw new Error('Cannot read user balance ' + errorCode.toString());
        }

        balance = stack.readBigNumber();
      }

      return balance == null ? null : Number(fromBigMoney(balance, decimals));
    },
    refetchInterval: 10_000,
    staleTime: 500,
    enabled: !!decimals,
  });
  return {
    ...query,
    isLoading: query.isLoading || jettonIsLoading,
  };
};

export const useTonTransferAssetsMutation = (slug?: string) => {
  const address = useTonAddress();
  const [tonConnectUI] = useTonConnectUI();
  const { data: { decimals, walletAddress } = {} } =
    useJettonWalletAddress(slug);
  const { save } = useUserStorage('last-parsed-deposit-address');
  const queryClient = useQueryClient();

  return async ({
    recipientAddress,
    amount,
    gasFee,
  }: {
    recipientAddress: string;
    amount: string;
    gasFee: string;
  }) => {
    if (!slug || !decimals) throw new Error('Wallet not connected');

    const noneBounceableAddress = Address.parse(recipientAddress).toString({
      bounceable: false,
      testOnly: !isProduction,
    });

    void save(noneBounceableAddress);

    const transaction: SendTransactionRequest = {
      validUntil: Date.now() + 10 * 60 * 1000,
      network: isProduction ? CHAIN.MAINNET : CHAIN.TESTNET,
      messages: [
        slug === 'the-open-network'
          ? {
              address: noneBounceableAddress,
              amount: toBigMoney(amount, 9).toString(),
            }
          : {
              address: walletAddress ?? '',
              amount: toBigMoney('0.05', 9).toString(),
              payload: beginCell()
                .storeUint(0xf_8a_7e_a5, 32) // jetton transfer op code
                .storeUint(0, 64) // query_id:uint64
                .storeCoins(toBigMoney(amount, decimals)) // amount:(VarUInteger 16) -  Jetton amount for transfer (decimals = 6 - USDT, 9 - default).
                .storeAddress(Address.parse(recipientAddress)) // destination:MsgAddress
                .storeAddress(Address.parse(address)) // response_destination:MsgAddress
                .storeUint(0, 1) // custom_payload:(Maybe ^Cell)
                .storeCoins(1) // forward_ton_amount:(VarUInteger 16) - if >0, will send notification message
                .storeUint(0, 1) // forward_payload:(Either Cell ^Cell)
                .endCell()
                .toBoc()
                .toString('base64'),
            },
        {
          address: noneBounceableAddress,
          amount: toBigMoney(gasFee, 9).toString(),
          payload: beginCell()
            .storeUint(0, 32) // write 32 zero bits to indicate that a text comment will follow
            .storeStringTail('Gas fee') // write our text comment
            .endCell()
            .toBoc()
            .toString('base64'),
        },
      ],
    };

    await tonConnectUI.sendTransaction(transaction);
    void queryClient.invalidateQueries({ queryKey: ['accountJettonBalance'] });
    gtag('event', 'trade');

    return () =>
      new Promise<boolean>(resolve => setTimeout(() => resolve(true), 7000));
  };
};

export function useAwaitTonWalletConnection() {
  const [tonConnectUI] = useTonConnectUI();
  const { open } = useTonConnectModal();

  return usePromiseOfEffect({
    action: open,
    done: tonConnectUI.connected || tonConnectUI.modalState.status === 'closed',
    result: tonConnectUI.connected,
  });
}
