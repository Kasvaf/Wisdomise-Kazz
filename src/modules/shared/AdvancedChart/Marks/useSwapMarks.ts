import { enrichSwap } from 'modules/autoTrader/useEnrichedSwaps';
import { useUnifiedCoinDetails } from 'modules/discovery/DetailView/CoinDetail/lib';
import { useTotalSupply } from 'modules/discovery/DetailView/CoinDetail/useTotalSupply';
import { useTrackedWallets } from 'modules/discovery/ListView/WalletTracker/useTrackedWallets';
import { useMemo } from 'react';
import { useAllWallets } from 'services/chains/wallet';
import type { Swap } from 'services/grpc/proto/delphinus';
import {
  useChartConvertToUSD,
  useChartIsMarketCap,
} from 'shared/AdvancedChart/chartSettings';
import { formatNumber } from 'utils/numbers';
import type { Mark } from '../../../../../public/charting_library';

export const useSwapsMarks = ({ swaps }: { swaps: Swap[] }) => {
  const [convertToUsd] = useChartConvertToUSD();
  const [isMarketCap] = useChartIsMarketCap();
  const { totalSupply } = useTotalSupply();
  const namedSwaps = useNamedSwaps({ swaps });

  return useMemo(() => {
    return (
      namedSwaps.map(s => {
        const swap = enrichSwap(s);

        const priceOrMc =
          (convertToUsd ? swap.usdPrice : swap.price) *
          (isMarketCap ? (totalSupply ?? 0) : 1);
        const formatedPriceOrMc = formatNumber(priceOrMc, {
          decimalLength: 3,
          minifyDecimalRepeats: !isMarketCap,
          compactInteger: isMarketCap,
          separateByComma: false,
          exactDecimal: isMarketCap,
        });
        const formatedVolume = formatNumber(
          Number(convertToUsd ? swap.usdAmount : swap.solAmount),
          {
            decimalLength: 3,
            minifyDecimalRepeats: false,
            compactInteger: false,
            separateByComma: false,
          },
        );
        const text = `${s.name} ${swap.dir === 'buy' ? 'bought' : 'sold'} $${formatedVolume} at ${formatedPriceOrMc} ${convertToUsd ? 'USD' : 'SOL'} ${isMarketCap ? 'Market Cap' : ''}`;
        const dirLabel = swap.dir === 'buy' ? 'B' : 'S';
        const label = `${s.label ? s.label : ''}${!s.name || s.name === 'Dev' ? dirLabel : ''}`;

        return {
          id: swap.txId,
          label,
          labelFontColor: 'white',
          minSize: 25,
          time: Math.floor(new Date(s.relatedAt).getTime() / 1000),
          price: priceOrMc,
          text,
          color: swap.dir === 'buy' ? 'green' : 'red',
        } as Mark;
      }) ?? []
    );
  }, [convertToUsd, isMarketCap, namedSwaps, totalSupply]);
};

export const useNamedSwaps = ({ swaps }: { swaps: Swap[] }) => {
  const wallets = useTrackedWallets();
  const { developer } = useUnifiedCoinDetails();
  const userWallets = useAllWallets();

  return useMemo(() => {
    return swaps
      .map(swap => {
        let name: string | undefined;
        let label: string | undefined;
        const trackedWallet = wallets.find(w => w.address === swap.wallet);
        const isUser = userWallets?.some(w => w === swap.wallet);
        if (isUser) {
          name = 'You';
          label = '';
        } else if (trackedWallet) {
          name = `${trackedWallet.emoji} ${trackedWallet.name}`;
          label = trackedWallet.emoji;
        } else if (swap.wallet === developer?.address) {
          name = 'Dev';
          label = 'D';
        }
        if (!name) return undefined;
        return { ...swap, name, label };
      })
      .filter(Boolean) as (Swap & { name: string; label: string })[];
  }, [swaps, developer, wallets, userWallets]);
};
