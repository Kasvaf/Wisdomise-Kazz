import { useTonAddress, useTonConnectUI } from '@tonconnect/ui-react';
import { useWallet } from '@solana/wallet-adapter-react';
import useActiveNetwork from 'modules/autoTrader/useActiveNetwork';
import {
  type AutoTraderSolanaSupportedQuotes,
  useSolanaAccountBalance,
  useSolanaTransferAssetsMutation,
} from './solana';
import {
  type AutoTraderTonSupportedQuotes,
  useAccountJettonBalance,
  useTonTransferAssetsMutation,
} from './ton';

export const useActiveWallet = () => {
  const net = useActiveNetwork();
  const tonAddress = useTonAddress();
  const [tonConnectUI] = useTonConnectUI();
  const solanaWallet = useWallet();

  return {
    address:
      net === 'the-open-network'
        ? tonAddress
        : net === 'solana'
        ? solanaWallet.publicKey?.toString()
        : undefined,
    connected:
      net === 'the-open-network'
        ? tonConnectUI.connected
        : net === 'solana'
        ? solanaWallet.connected
        : false,
    connect: () => {
      if (net === 'the-open-network') return tonConnectUI.openModal();
      if (net === 'solana') return solanaWallet.connect();
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

export const useAccountBalance = (quote: AutoTraderSupportedQuotes) => {
  const net = useActiveNetwork();
  const solResult = useSolanaAccountBalance(ensureSolQuote(quote));
  const tonResult = useAccountJettonBalance(ensureTonQuote(quote));

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
