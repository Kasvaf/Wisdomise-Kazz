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
  if (net === 'ton') return tonResult;
  return { data: null, isLoading: false };
};

export const useAccountNativeBalance = () => {
  const net = useActiveNetwork();
  return useAccountBalance(
    net === 'ton' ? 'the-open-network' : 'wrapped-solana',
  );
};

export const useTransferAssetsMutation = (quote: AutoTraderSupportedQuotes) => {
  const net = useActiveNetwork();
  const transferTonAssets = useTonTransferAssetsMutation(ensureTonQuote(quote));
  const transferSolanaAssets = useSolanaTransferAssetsMutation(
    ensureSolQuote(quote),
  );

  if (net === 'solana') return transferSolanaAssets;
  if (net === 'ton') return transferTonAssets;
  return () => {
    throw new Error('Invalid network');
  };
};
