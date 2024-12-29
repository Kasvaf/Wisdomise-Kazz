import {
  CHAIN,
  useTonAddress,
  useTonConnectUI,
  type SendTransactionRequest,
} from '@tonconnect/ui-react';
import { Address, beginCell, TonClient } from '@ton/ton';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { isProduction } from 'utils/version';
import { useUserStorage } from 'api/userStorage';
import { fromBigMoney, toBigMoney } from 'utils/money';

const tonClient = new TonClient({
  endpoint: `${String(import.meta.env.VITE_TONCENTER_BASE_URL)}/api/v2/jsonRPC`,
});

export const USDT_DECIMAL = Number(import.meta.env.VITE_USDT_DECIMAL);
export const USDT_CONTRACT_ADDRESS = String(
  import.meta.env.VITE_USDT_CONTRACT_ADDRESS,
);
export const WSDM_CONTRACT_ADDRESS = String(
  import.meta.env.VITE_WSDM_CONTRACT_ADDRESS,
);

const CONTRACT_ADDRESSES = {
  WSDM: WSDM_CONTRACT_ADDRESS,
  tether: USDT_CONTRACT_ADDRESS,
} as const;

const CONTRACT_DECIMAL = {
  'the-open-network': 9,
  'WSDM': 6,
  'tether': USDT_DECIMAL,
} as const;

export type AutoTraderSupportedQuotes = 'tether' | 'the-open-network';

export const useAccountJettonBalance = (
  contract: 'WSDM' | AutoTraderSupportedQuotes,
) => {
  const address = useTonAddress();
  const { data: jettonAddress } = useJettonWalletAddress(contract);
  const addr = contract === 'the-open-network' ? address : jettonAddress;

  return useQuery(
    ['accountJettonBalance', contract, addr],
    async () => {
      if (!addr) return null;
      const parsedAddress = Address.parse(addr);

      let balance: bigint | undefined;
      if (contract === 'the-open-network') {
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

      return balance == null
        ? null
        : Number(fromBigMoney(balance, CONTRACT_DECIMAL[contract]));
    },
    {
      refetchInterval: 10_000,
      staleTime: 500,
    },
  );
};

const useJettonWalletAddress = (quote: 'WSDM' | AutoTraderSupportedQuotes) => {
  const address = useTonAddress();

  return useQuery(
    ['jetton-wallet-address', address, quote],
    async () => {
      if (!address || quote === 'the-open-network') return;

      const jettonMasterAddress = Address.parse(CONTRACT_ADDRESSES[quote]);
      const ownerAddress = Address.parse(address);

      try {
        const { stack } = await tonClient.runMethod(
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

export const useTransferAssetsMutation = (quote: AutoTraderSupportedQuotes) => {
  const address = useTonAddress();
  const [tonConnectUI] = useTonConnectUI();
  const { data: jettonWalletAddress } = useJettonWalletAddress(quote);
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
    const noneBounceableAddress = Address.parse(recipientAddress).toString({
      bounceable: false,
      testOnly: !isProduction,
    });

    void save(noneBounceableAddress);

    const transaction: SendTransactionRequest = {
      validUntil: Date.now() + 10 * 60 * 1000,
      network: isProduction ? CHAIN.MAINNET : CHAIN.TESTNET,
      messages: [
        quote === 'the-open-network'
          ? {
              address: noneBounceableAddress,
              amount: toBigMoney(amount, 9).toString(),
            }
          : {
              address: jettonWalletAddress ?? '',
              amount: toBigMoney('0.05', 9).toString(),
              payload: beginCell()
                .storeUint(0xf_8a_7e_a5, 32) // jetton transfer op code
                .storeUint(0, 64) // query_id:uint64
                .storeCoins(toBigMoney(amount, CONTRACT_DECIMAL[quote])) // amount:(VarUInteger 16) -  Jetton amount for transfer (decimals = 6 - USDT, 9 - default).
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
    await queryClient.invalidateQueries(['accountJettonBalance']);
  };
};
