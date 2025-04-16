import { useTonAddress, useTonConnectUI } from '@tonconnect/ui-react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useActiveNetwork } from 'modules/base/active-network';
import { trackClick } from 'config/segment';
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
  return async () => {
    try {
      await Promise.all([solDisconnect(), tonDisconnect()]);
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

const ensureSolQuote = (
  quote: AutoTraderSupportedQuotes,
): AutoTraderSolanaSupportedQuotes | undefined =>
  quote === 'the-open-network' ? undefined : quote;

const ensureTonQuote = (
  quote: AutoTraderSupportedQuotes,
): AutoTraderTonSupportedQuotes | undefined =>
  quote === 'wrapped-solana' || quote === 'usd-coin' ? undefined : quote;

export const useAccountBalance = (
  quote: AutoTraderSupportedQuotes,
  network?: 'solana' | 'the-open-network' | null,
) => {
  const activeNet = useActiveNetwork();
  const solResult = useSolanaAccountBalance(ensureSolQuote(quote));
  const tonResult = useAccountJettonBalance(ensureTonQuote(quote));

  const net = network ?? activeNet;
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

export const useTransferAssetsMutation = (quote: AutoTraderSupportedQuotes) => {
  const net = useActiveNetwork();
  const transferTonAssets = useTonTransferAssetsMutation(ensureTonQuote(quote));
  const transferSolanaAssets = useSolanaTransferAssetsMutation(
    ensureSolQuote(quote),
  );

  if (net === 'solana') return transferSolanaAssets;
  if (net === 'the-open-network') return transferTonAssets;
  return () => {
    throw new Error('Invalid network');
  };
};
