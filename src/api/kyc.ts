import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import useMainQuote from 'modules/shared/useMainQuote';
import { ACCOUNT_PANEL_ORIGIN } from 'config/constants';
import { useMarketNetworksQuery } from './market';
import { useInvestorAssetStructuresQuery } from './ias';
import { type Network } from './types/NetworksResponse';

export interface RawVerifiedWallet {
  name?: string | null;
  address: string;
  network: {
    name: string; // TRX
    description: string; // Tron (TRC20)
  };
  symbol: {
    name: string; // USDT
    title: string; // Tether USDt
  };
}

const useRawWallets = () =>
  useQuery<RawVerifiedWallet[]>(['wallets'], async () => {
    const { data } = await axios.get<{ results: RawVerifiedWallet[] }>(
      `${ACCOUNT_PANEL_ORIGIN}/api/v1/kyc/wallets`,
    );
    return data.results;
  });

export interface VerifiedWallet {
  name?: string | null;
  address: string;
  network?: Network;
  symbol: {
    name: string; // USDT
    title: string; // Tether USDt
  };
}

export const useVerifiedWallets = () => {
  const ias = useInvestorAssetStructuresQuery();
  const mea = ias.data?.[0]?.main_exchange_account;
  const mainQuote = useMainQuote();
  const networks = useMarketNetworksQuery({
    usage: 'withdrawable',
    symbol: mainQuote,
    exchangeAccountKey: mea?.key,
  });
  const wallets = useRawWallets();
  return {
    isLoading: networks.isLoading || wallets.isLoading,
    data: wallets.data?.map(x => ({
      ...x,
      network: networks.data?.find(y => y.name === x.name),
    })),
  };
};
