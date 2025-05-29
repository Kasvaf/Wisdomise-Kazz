import { useTonAddress, useTonConnectUI } from '@tonconnect/ui-react';
import {
  useAppKitAccount,
  useAppKitNetwork,
  useDisconnect,
  useWalletInfo,
} from '@reown/appkit/react';
import { useLocalStorage } from 'usehooks-ts';
import { useActiveNetwork } from 'modules/base/active-network';
import { trackClick } from 'config/segment';
import { useSymbolsInfo } from 'api/symbol';
import { type SupportedNetworks } from 'api';
import { useWalletsQuery } from 'api/wallets';
import {
  type AutoTraderSolanaSupportedQuotes,
  useAwaitSolanaWalletConnection,
  useSolanaAccountBalance,
  useSolanaMarketSwap,
  useSolanaTransferAssetsMutation,
  useSolanaUserAssets,
} from './solana';
import {
  type AutoTraderTonSupportedQuotes,
  useAccountJettonBalance,
  useAwaitTonWalletConnection,
  useTonTransferAssetsMutation,
  useTonUserAssets,
} from './ton';

export const useDisconnectAll = () => {
  const [{ disconnect: tonDisconnect }] = useTonConnectUI();
  const { disconnect } = useDisconnect();

  return async () => {
    try {
      await Promise.all([disconnect(), tonDisconnect()]);
    } catch {
    } finally {
      for (const key of Object.keys(localStorage)) {
        if (/^(wallet|ton|@appkit|binance|ethereum)/.test(key)) {
          localStorage.removeItem(key);
        }
      }
    }
  };
};

export const useCustodialWallet = () => {
  const { data: wallets } = useWalletsQuery();
  const [cwKey, setCw] = useLocalStorage<string | undefined>(
    'custodial-address',
    undefined,
  );
  const cw = wallets?.results.find(w => w.key === cwKey);

  return { cw, setCw };
};

export const useActiveClientWallet = () => {
  const net = useActiveNetwork();

  const tonAddress = useTonAddress();
  const [tonConnectUI] = useTonConnectUI();

  const { address: appKitAddress, isConnected: isAppKitConnected } =
    useAppKitAccount();
  const appKitWalletInfo = useWalletInfo();
  const { caipNetwork } = useAppKitNetwork();

  const chainNameSpace = caipNetwork?.chainNamespace;
  const isValidChain =
    chainNameSpace === (net === 'solana' ? 'solana' : 'eip155');

  const awaitSolanaWalletConnect = useAwaitSolanaWalletConnection(
    net === 'the-open-network' ? undefined : net,
  );
  const awaitTonWalletConnect = useAwaitTonWalletConnection();

  return {
    address:
      net === 'the-open-network'
        ? tonAddress
        : net === 'solana' || net === 'polygon'
        ? appKitAddress
        : undefined,
    name:
      net === 'the-open-network'
        ? tonConnectUI.wallet?.device.appName
        : net === 'solana' || net === 'polygon'
        ? appKitWalletInfo.walletInfo?.name
        : undefined,
    connected:
      net === 'the-open-network'
        ? tonConnectUI.connected
        : net === 'solana' || net === 'polygon'
        ? isAppKitConnected && isValidChain
        : false,
    icon:
      net === 'solana' || net === 'polygon'
        ? appKitWalletInfo.walletInfo?.icon
        : undefined,

    connect: () => {
      trackClick('wallet_connect', { network: net })();
      if (net === 'the-open-network') {
        return awaitTonWalletConnect();
      }
      if (net === 'solana' || net === 'polygon') {
        return awaitSolanaWalletConnect();
      }
      return Promise.resolve();
    },
  };
};

export const useActiveWallet = () => {
  const { address, name, connected, connect } = useActiveClientWallet();
  const net = useActiveNetwork();
  const { cw } = useCustodialWallet();
  const custodialSupported = cw && net === 'solana';

  return {
    address: custodialSupported ? cw.address : address,
    name: custodialSupported ? cw.name : name,
    connected: custodialSupported ? true : connected,
    isCustodial: custodialSupported,
    connect,
  };
};

export type AutoTraderSupportedQuotes =
  | AutoTraderTonSupportedQuotes
  | AutoTraderSolanaSupportedQuotes;

export const useAccountBalance = (
  quote?: string,
  network?: SupportedNetworks | null,
  address?: string,
) => {
  const activeNet = useActiveNetwork();
  const net = network ?? activeNet;

  const solResult = useSolanaAccountBalance(
    net === 'solana' ? quote : undefined,
    address,
  );
  const tonResult = useAccountJettonBalance(
    net === 'the-open-network' ? quote : undefined,
    address,
  );

  if (net === 'solana') return solResult;
  if (net === 'the-open-network') return tonResult;
  return { data: null, isLoading: !net };
};

export const useUserWalletAssets = (
  network?: 'solana' | 'the-open-network' | null,
) => {
  const activeNet = useActiveNetwork();
  const net = network ?? activeNet;

  const solResult = useSolanaUserAssets();
  const tonResult = useTonUserAssets();

  if (net === 'solana') return solResult;
  if (net === 'the-open-network') return tonResult;
  return { data: null, isLoading: false };
};

export const useAccountNativeBalance = (address?: string) => {
  const net = useActiveNetwork();
  return useAccountBalance(
    net === 'the-open-network' ? 'the-open-network' : 'wrapped-solana',
    undefined,
    address,
  );
};

export const useAccountAllQuotesBalance = () => {
  const net = useActiveNetwork();
  const { data: tonBalance, isLoading: l1 } = useAccountBalance(
    'the-open-network',
    net,
  );
  const { data: tetherBalance, isLoading: l2 } = useAccountBalance(
    'tether',
    net,
  );
  const { data: usdCoinBalance, isLoading: l3 } = useAccountBalance(
    'usd-coin',
    net,
  );
  const { data: solBalance, isLoading: l4 } = useAccountBalance(
    'wrapped-solana',
    net,
  );

  return {
    tonBalance,
    tetherBalance,
    usdCoinBalance,
    solBalance,
    isLoading: l1 || l2 || l3 || l4,
  };
};

export const useTransferAssetsMutation = (quote?: string) => {
  const net = useActiveNetwork();
  const transferTonAssets = useTonTransferAssetsMutation(
    net === 'the-open-network' ? quote : undefined,
  );
  const transferSolanaAssets = useSolanaTransferAssetsMutation(
    net === 'solana' ? quote : undefined,
  );

  if (net === 'solana') return transferSolanaAssets;
  if (net === 'the-open-network') return transferTonAssets;
  return () => {
    throw new Error('Invalid network');
  };
};

export const useMarketSwap = () => {
  const net = useActiveNetwork();
  const solanaMarketSwap = useSolanaMarketSwap();

  if (net === 'solana') return solanaMarketSwap;

  return () => {
    throw new Error('Invalid network');
  };
};

export const useSupportedQuotesSymbols = () => {
  const quotes = [
    'tether',
    'usd-coin',
    'wrapped-solana',
    'the-open-network',
  ] satisfies AutoTraderSupportedQuotes[];
  type AssertAllQuotes =
    AutoTraderSupportedQuotes extends (typeof quotes)[number]
      ? readonly AutoTraderSupportedQuotes[]
      : never;
  return useSymbolsInfo(quotes satisfies AssertAllQuotes);
};
