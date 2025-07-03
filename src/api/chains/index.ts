import { useActiveNetwork } from 'modules/base/active-network';
import { type SupportedNetworks } from 'api';
import {
  useSolanaAccountBalance,
  useSolanaMarketSwap,
  useSolanaTransferAssetsMutation,
  useSolanaUserAssets,
} from './solana';
import {
  useAccountJettonBalance,
  useTonTransferAssetsMutation,
  useTonUserAssets,
} from './ton';

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
  return {
    data: null,
    isLoading: !net,
    refetch: () => {
      return null;
    },
  };
};

export const useUserWalletAssets = (
  network?: 'solana' | 'the-open-network' | null,
  address?: string,
) => {
  const activeNet = useActiveNetwork();
  const net = network ?? activeNet;

  const solResult = useSolanaUserAssets(address);
  const tonResult = useTonUserAssets(address);

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
