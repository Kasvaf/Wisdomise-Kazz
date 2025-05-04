import { useTonAddress, useTonConnectUI } from '@tonconnect/ui-react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useDisconnect } from 'wagmi';
import { useActiveNetwork } from 'modules/base/active-network';
import { trackClick } from 'config/segment';
import { useSymbolsInfo } from 'api/symbol';
import { type SupportedNetworks } from 'api';
import {
  type AutoTraderSolanaSupportedQuotes,
  useAwaitSolanaWalletConnection,
  useSolanaAccountBalance,
  useSolanaTransferAssetsMutation,
} from './solana';
import {
  type AutoTraderTonSupportedQuotes,
  useAccountJettonBalance,
  useAwaitTonWalletConnection,
  useTonTransferAssetsMutation,
} from './ton';

export const useDisconnectAll = () => {
  const { disconnect: solDisconnect } = useWallet();
  const [{ disconnect: tonDisconnect }] = useTonConnectUI();
  const { disconnectAsync } = useDisconnect();

  return async () => {
    try {
      await Promise.all([disconnectAsync(), solDisconnect(), tonDisconnect()]);
    } catch {
    } finally {
      for (const key of Object.keys(localStorage)) {
        if (/^(wallet|ton)/.test(key)) {
          localStorage.removeItem(key);
        }
      }
    }
  };
};

export const useActiveWallet = () => {
  const net = useActiveNetwork();
  const tonAddress = useTonAddress();
  const [tonConnectUI] = useTonConnectUI();
  const solanaWallet = useWallet();
  const awaitSolanaWalletConnect = useAwaitSolanaWalletConnection();
  const awaitTonWalletConnect = useAwaitTonWalletConnection();

  return {
    address:
      net === 'the-open-network'
        ? tonAddress
        : net === 'solana'
        ? solanaWallet.publicKey?.toString()
        : undefined,
    name:
      net === 'the-open-network'
        ? tonConnectUI.wallet?.device.appName
        : net === 'solana'
        ? solanaWallet.wallet?.adapter.name
        : undefined,
    connected:
      net === 'the-open-network'
        ? tonConnectUI.connected
        : net === 'solana'
        ? solanaWallet.connected
        : false,
    connect: () => {
      trackClick('wallet_connect', { network: net })();
      if (net === 'the-open-network') {
        return awaitTonWalletConnect();
      }
      if (net === 'solana') {
        return awaitSolanaWalletConnect();
      }
      return Promise.resolve();
    },
  };
};

export type AutoTraderSupportedQuotes =
  | AutoTraderTonSupportedQuotes
  | AutoTraderSolanaSupportedQuotes;

export const useAccountBalance = (
  quote?: string,
  network?: SupportedNetworks | null,
) => {
  const activeNet = useActiveNetwork();
  const net = network ?? activeNet;

  const solResult = useSolanaAccountBalance(
    net === 'solana' ? quote : undefined,
  );
  const tonResult = useAccountJettonBalance(
    net === 'the-open-network' ? quote : undefined,
  );

  if (net === 'solana') return solResult;
  if (net === 'the-open-network') return tonResult;
  return { data: null, isLoading: false };
};

export const useAccountNativeBalance = () => {
  const net = useActiveNetwork();
  return useAccountBalance(
    net === 'the-open-network' ? 'the-open-network' : 'wrapped-solana',
  );
};

export const useAccountAllQuotesBalance = () => {
  const net = useActiveNetwork();
  const { data: tonBalance } = useAccountBalance('the-open-network', net);
  const { data: tetherBalance } = useAccountBalance('tether', net);
  const { data: usdCoinBalance } = useAccountBalance('usd-coin', net);
  const { data: solBalance } = useAccountBalance('wrapped-solana', net);

  return {
    tonBalance,
    tetherBalance,
    usdCoinBalance,
    solBalance,
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
