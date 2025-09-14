import { notification, Spin } from 'antd';
import type { SupportedNetworks } from 'api';
import { useSolanaUserAssets } from 'modules/autoTrader/UserAssets/useSolanaUserAssets';
import { useActiveNetwork } from 'modules/base/active-network';
import {
  type TradeSettingsSource,
  useUserSettings,
} from 'modules/base/auth/UserSettingsProvider';
import { useEffect, useState } from 'react';
import {
  useSolanaAccountBalance,
  useSolanaMarketSwap,
  useSolanaTransferAssetsMutation,
} from './solana';
import {
  useAccountJettonBalance,
  useTonTransferAssetsMutation,
  useTonUserAssets,
} from './ton';

export const useAccountBalance = ({
  slug,
  network,
  address,
  enabled = true,
}: {
  slug?: string;
  network?: SupportedNetworks | null;
  address?: string;
  enabled?: boolean;
}) => {
  const activeNet = useActiveNetwork();
  const net = network ?? activeNet;

  const solResult = useSolanaAccountBalance({
    slug: net === 'solana' ? slug : undefined,
    address,
    enabled,
  });
  const tonResult = useAccountJettonBalance(
    net === 'the-open-network' ? slug : undefined,
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
  const network = useActiveNetwork();
  return useAccountBalance({
    slug:
      network === 'the-open-network' ? 'the-open-network' : 'wrapped-solana',
    address,
  });
};

export const useAccountAllQuotesBalance = () => {
  const network = useActiveNetwork();
  const { data: tonBalance, isLoading: l1 } = useAccountBalance({
    slug: 'the-open-network',
    network,
  });
  const { data: tetherBalance, isLoading: l2 } = useAccountBalance({
    slug: 'tether',
    network,
  });
  const { data: usdCoinBalance, isLoading: l3 } = useAccountBalance({
    slug: 'usd-coin',
    network,
  });
  const { data: solBalance, isLoading: l4 } = useAccountBalance({
    slug: 'wrapped-solana',
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

export const useMarketSwap = ({
  slug,
  quote,
  source,
}: {
  slug?: string;
  quote?: string;
  source: TradeSettingsSource;
}) => {
  const net = useActiveNetwork();
  const solanaMarketSwap = useSolanaMarketSwap();
  const { data: baseBalance, refetch } = useAccountBalance({
    slug,
    enabled: false,
  });
  const { getActivePreset } = useUserSettings();
  const { data: quoteBalance } = useAccountBalance({ slug: quote });

  const handleMarketSwap = async (side: 'LONG' | 'SHORT', amount: string) => {
    const notificationKey = Date.now();
    const balance = baseBalance ?? (await refetch())?.data;

    const preset = getActivePreset(source)[side === 'LONG' ? 'buy' : 'sell'];
    const priorityFee = preset.sol_priority_fee;
    const slippage = preset.slippage;

    const coverPriorityFee =
      side === 'LONG' && quote === 'wrapped-solana'
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

    try {
      notification.open({
        key: notificationKey,
        message: <NotificationContent />,
        duration: 30_000,
      });
      const confirmed = await solanaMarketSwap(
        slug,
        quote,
        side,
        amount,
        slippage,
        priorityFee,
      );
      const now = new Date();

      const time = now.toLocaleTimeString('en-US', {
        hour12: false, // 24h format
        timeZone: 'Asia/Tehran',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });

      // append milliseconds
      const ms = String(now.getMilliseconds()).padStart(3, '0');

      console.log(`${time}.${ms}`);
      console.log('confirmed', Date.now());

      if (confirmed) {
        notification.success({
          key: notificationKey,
          message: 'Transaction confirmed!',
        });
      }
    } catch (error) {
      notification.error({
        key: notificationKey,
        message: `Failed to execute transaction. ${error}`,
      });
    }
  };

  if (net === 'solana') return handleMarketSwap;

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
