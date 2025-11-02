import { notification, Spin } from 'antd';
import type { SupportedNetworks } from 'api';
import {
  USDC_CONTRACT_ADDRESS,
  USDT_CONTRACT_ADDRESS,
  WRAPPED_SOLANA_CONTRACT_ADDRESS,
  WRAPPED_SOLANA_SLUG,
} from 'api/chains/constants';
import { useConfirmTransaction } from 'modules/autoTrader/BuySellTrader/useConfirmTransaction';
import { useSolanaWalletPricedAssets } from 'modules/autoTrader/UserAssets/useSolanaWalletPricedAssets';
import { useActiveNetwork } from 'modules/base/active-network';
import {
  type TradeSettingsSource,
  useUserSettings,
} from 'modules/base/auth/UserSettingsProvider';
import { useEffect, useState } from 'react';
import {
  useSolanaSwap,
  useSolanaTokenBalance,
  useSolanaTransferAssetsMutation,
} from './solana';

export const useTokenBalance = ({
  network,
  slug,
  tokenAddress,
  walletAddress,
  enabled = true,
}: {
  network?: SupportedNetworks;
  slug?: string;
  tokenAddress?: string;
  walletAddress?: string;
  enabled?: boolean;
}) => {
  const activeNet = useActiveNetwork();
  const net = network ?? activeNet;

  const solResult = useSolanaTokenBalance({
    slug,
    tokenAddress,
    walletAddress,
    enabled: enabled && net === 'solana',
  });

  if (net === 'solana') return solResult;

  return {
    data: null,
    isLoading: !net,
    refetch: () => {
      return null;
    },
  };
};

export const useWalletAssets = ({
  network,
  address,
}: {
  network?: 'solana';
  address?: string;
}) => {
  const activeNet = useActiveNetwork();
  const net = network ?? activeNet;

  const solResult = useSolanaWalletPricedAssets(address);

  if (net === 'solana') return solResult;

  throw new Error('network is invalid');
};

export const useNativeTokenBalance = (walletAddress?: string) => {
  const network = useActiveNetwork();
  return useTokenBalance({
    slug:
      network === 'the-open-network' ? 'the-open-network' : WRAPPED_SOLANA_SLUG,
    walletAddress,
  });
};

export const useAllQuotesBalance = () => {
  const network = useActiveNetwork();
  const { data: tonBalance, isLoading: l1 } = useTokenBalance({
    slug: 'the-open-network',
    network,
  });
  const { data: tetherBalance, isLoading: l2 } = useTokenBalance({
    tokenAddress: USDT_CONTRACT_ADDRESS,
    network,
  });
  const { data: usdCoinBalance, isLoading: l3 } = useTokenBalance({
    tokenAddress: USDC_CONTRACT_ADDRESS,
    network,
  });
  const { data: solBalance, isLoading: l4 } = useTokenBalance({
    tokenAddress: WRAPPED_SOLANA_CONTRACT_ADDRESS,
    network,
  });

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
  const transferSolanaAssets = useSolanaTransferAssetsMutation(
    net === 'solana' ? quote : undefined,
  );

  if (net === 'solana') return transferSolanaAssets;

  return () => {
    throw new Error('Invalid network');
  };
};

export const swapsNotifications = new Map<string, number>();

export const useSwap = ({
  slug,
  tokenAddress,
  quote,
  source,
}: {
  slug?: string;
  tokenAddress?: string;
  quote?: string;
  source: TradeSettingsSource;
}) => {
  const net = useActiveNetwork();
  const solanaSwap = useSolanaSwap();
  const { data: baseBalance, refetch } = useTokenBalance({
    slug,
    tokenAddress,
    enabled: false,
  });
  const { getActivePreset } = useUserSettings();
  const { data: quoteBalance } = useTokenBalance({ slug: quote });
  const { confirm } = useConfirmTransaction({ slug });

  const attemptSolanaSwap = async (side: 'LONG' | 'SHORT', amount: string) => {
    const balance = baseBalance ?? (await refetch())?.data;

    const preset = getActivePreset(source)[side === 'LONG' ? 'buy' : 'sell'];
    const priorityFee = preset.sol_priority_fee;
    const slippage = preset.slippage;

    const coverPriorityFee =
      side === 'LONG' && quote === WRAPPED_SOLANA_SLUG
        ? +amount + +priorityFee < (quoteBalance ?? 0)
        : +priorityFee < (quoteBalance ?? 0);

    if (
      (side === 'LONG' && (quoteBalance ?? 0) < +amount) ||
      (side === 'SHORT' && (balance ?? 0) === 0)
    ) {
      notification.error({ message: 'Insufficient balance' });
      return;
    }

    if (!coverPriorityFee) {
      notification.error({
        message: 'Insufficient SOL balance to cover priority fee',
      });
      return;
    }

    if (+amount < 0.0001) {
      notification.error({
        message: 'Minimum amount should be greater than 0.0001 SOL',
      });
      return;
    }

    if (!slug || !quote) {
      throw new Error('slug or quote not found');
    }

    const notificationKey = Date.now();
    try {
      notification.open({
        key: notificationKey,
        message: <NotificationContent />,
        duration: 30_000,
      });
      const attemptTime = Date.now();
      console.log('attempt', new Date(attemptTime).toISOString());
      const { swapKey } = await solanaSwap(
        slug,
        quote,
        side,
        amount,
        slippage,
        priorityFee,
      );
      const doneTime = Date.now();
      console.log(
        'swap created',
        new Date(doneTime).toISOString(),
        'diff: ',
        doneTime - attemptTime,
      );
      swapsNotifications.set(swapKey, notificationKey);
      confirm({ swapKey });
    } catch (error) {
      notification.error({
        key: notificationKey,
        message: `Failed to execute transaction. ${error}`,
      });
    }
  };

  if (net === 'solana') return attemptSolanaSwap;

  return () => {
    throw new Error('Invalid network');
  };
};

const NotificationContent = () => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCount(prevCount => prevCount + 1);
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="flex items-center gap-2">
      <Spin /> Attempting transaction ({count}s)
    </div>
  );
};
