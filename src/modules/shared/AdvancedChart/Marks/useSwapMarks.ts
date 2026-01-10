import { enrichSwap } from 'modules/autoTrader/useEnrichedSwaps';
import { useUnifiedCoinDetails } from 'modules/discovery/DetailView/CoinDetail/lib';
import { useTotalSupply } from 'modules/discovery/DetailView/CoinDetail/useTotalSupply';
import { useTrackedWallets } from 'modules/discovery/ListView/WalletTracker/useTrackedWallets';
import { useEffect, useMemo, useState } from 'react';
import { useWalletsAddresses } from 'services/chains/wallet';
import type { Swap } from 'services/grpc/proto/delphinus';
import { useKolWallets } from 'services/rest/kol';
import {
  useChartConvertToUSD,
  useChartIsMarketCap,
} from 'shared/AdvancedChart/chartSettings';
import { formatNumber } from 'utils/numbers';
import type { Mark } from '../../../../../public/charting_library';

export const useSwapsMarks = ({
  swaps,
  deviceType,
}: {
  swaps: Swap[];
  deviceType: 'mobile' | 'tablet' | 'desktop';
}) => {
  const { symbol } = useUnifiedCoinDetails();
  const [convertToUsd] = useChartConvertToUSD();
  const [isMarketCap] = useChartIsMarketCap();
  const { totalSupply } = useTotalSupply();
  const [marks, setMarks] = useState<Mark[]>([]);
  const namedSwaps = useNamedSwaps({ swaps });

  // Use smaller mark size on mobile for better visibility and reduced overlap
  const markSize = deviceType === 'mobile' || deviceType === 'tablet' ? 16 : 25;

  // Debug log to verify device detection and mark sizing
  console.log(
    '[useSwapMarks] Device type:',
    deviceType,
    '| Mark size:',
    markSize,
  );

  // biome-ignore lint/correctness/useExhaustiveDependencies: namedSwaps intentionally excluded
  useEffect(() => {
    setMarks([]);
  }, [isMarketCap, convertToUsd, symbol.contractAddress]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: markSize intentionally included
  useEffect(() => {
    for (const s of namedSwaps) {
      if (!marks.map(m => m.id).includes(s.txId)) {
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
        const label = `${s.label ? s.label : ''}${!s.label || s.name === 'Dev' ? dirLabel : ''}`;

        const mark: Mark = {
          id: `swap_${swap.wallet}_${swap.txId}`,
          label,
          labelFontColor: 'white',
          minSize: markSize,
          imageUrl: s.image,
          time: Math.floor(new Date(s.relatedAt).getTime() / 1000),
          text,
          color: swap.dir === 'buy' ? 'green' : 'red',
        };
        setMarks(prev => {
          return [...prev, mark];
        });
      }
    }
  }, [namedSwaps, isMarketCap, totalSupply, convertToUsd, markSize]);

  return marks;
};

export const useNamedSwaps = ({ swaps }: { swaps: Swap[] }) => {
  const wallets = useTrackedWallets();
  const { developer } = useUnifiedCoinDetails();
  const userWallets = useWalletsAddresses();
  const { data: kols } = useKolWallets({});

  return useMemo(() => {
    return swaps
      .map(swap => {
        let name: string | undefined;
        let label: string | undefined;
        let image: string | undefined;
        const trackedWallet = wallets.find(w => w.address === swap.wallet);
        const kol = kols?.find(k => k.wallet_address === swap.wallet);
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
        } else if (kol) {
          name = kol.name;
          label = 'K';
          image = kol.image_url;
        }
        if (!name) return undefined;
        return { ...swap, name, label, image };
      })
      .filter(Boolean) as (Swap & {
      name: string;
      label: string;
      image?: string;
    })[];
  }, [swaps, developer, wallets, userWallets, kols]);
};
