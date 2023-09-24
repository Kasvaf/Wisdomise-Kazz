import axios from 'axios';
import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ACCOUNT_PANEL_ORIGIN } from 'config/constants';
import { useUserInfoQuery } from './account';
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
  const mainQuote = mea?.quote.name || '';

  const networks = useMarketNetworksQuery({
    usage: 'withdrawable',
    symbol: mainQuote,
    exchangeAccountKey: mea?.key,
  });
  const wallets = useRawWallets();

  return useMemo(
    () => ({
      isLoading: (mea && networks.isLoading) || wallets.isLoading,
      data: wallets.data?.map(wallet => ({
        ...wallet,
        network:
          networks.data?.find(net => net.name === wallet.network.name) ||
          wallet.network,
      })),
    }),
    [networks, wallets, mea],
  );
};

export const useSumsubVerified = () =>
  useQuery(['ssLevels'], async () => {
    const { data } = await axios.get<{
      results: Array<{
        status: 'UNVERIFIED' | 'PENDING' | 'VERIFIED' | 'REJECTED';
      }>;
    }>(`${ACCOUNT_PANEL_ORIGIN}/api/v1/kyc/user-kyc-levels`);
    return data.results?.[0]?.status || 'UNVERIFIED';
  });

export const useIsVerified = () => {
  const verified = useSumsubVerified();
  const userInfo = useUserInfoQuery();
  const wallets = useRawWallets();
  return useMemo(
    () => ({
      isLoading: verified.isLoading || userInfo.isLoading || wallets.isLoading,
      isAllVerified:
        verified.data === 'VERIFIED' &&
        userInfo.data?.account.wisdomise_verification_status === 'VERIFIED' &&
        Boolean(wallets.data?.length),

      identified: verified.data,
      verified: userInfo.data?.account.wisdomise_verification_status,
      addedWallet: Boolean(wallets.data?.length),
    }),
    [verified, userInfo, wallets],
  );
};

// const levelName = 'basic-kyc-level';
const levelName = 'Onlineident natural person';

export const getSumsubToken = async () => {
  const { data } = await axios.get<{ token: string }>(
    `${ACCOUNT_PANEL_ORIGIN}/api/v1/kyc/sumsub-access-token?level_name=${levelName}`,
  );
  return data.token;
};
