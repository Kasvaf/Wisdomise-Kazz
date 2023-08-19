import axios from 'axios';
import { useMutation, useQuery } from '@tanstack/react-query';
import { type DepositAddress } from '../types/DepositAddress';
import { useInvestorAssetStructuresQuery } from './investor-asset-structures';

export const useDepositWalletAddressQuery = ({
  symbol,
  network,
}: {
  symbol?: string;
  network?: string;
}) => {
  const ias = useInvestorAssetStructuresQuery();
  const eak = ias?.data?.[0]?.main_exchange_account?.key;
  return useQuery<DepositAddress>(
    ['dwa', symbol, network],
    async () => {
      const { data } = await axios.get<DepositAddress>(
        `/ias/exchange-accounts/${eak}/deposit-addresses?symbol_name=${symbol}&network_name=${network}`,
      );
      return data;
    },
    {
      enabled: Boolean(eak && symbol && network),
    },
  );
};

export const useCreateWithdrawMutation =
  () =>
  async (body: {
    tx_type: string;
    symbol_name: string;
    network_name: string;
    address: string;
    amount: string;
    exchangeAccountKey: string;
  }) => {
    const { data } = await axios.post<{ key: string }>(
      `/ias/exchange-accounts/${body.exchangeAccountKey}/transactions`,
      body,
    );
    return data;
  };

export const useConfirmWithdrawMutation =
  () =>
  async (p: {
    exchangeAccountKey: string;
    transactionKey: string;
    verificationCode: string;
  }) => {
    const { data, status, statusText } = await axios.patch(
      `/ias/exchange-accounts/${p.exchangeAccountKey}/transactions/${p.transactionKey}?verification_code=${p.verificationCode}`,
    );
    if (status >= 400) throw new Error(statusText);
    return data;
  };

export const useResendWithdrawEmailMutation =
  () => async (p: { exchangeAccountKey: string; transactionKey: string }) => {
    const { data } = await axios.post(
      `/ias/exchange-accounts/${p.exchangeAccountKey}/transactions/${p.transactionKey}/verification-email`,
    );
    return data;
  };
