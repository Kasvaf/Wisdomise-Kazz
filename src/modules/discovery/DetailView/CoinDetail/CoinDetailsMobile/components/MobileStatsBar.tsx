import {
  bxCoin,
  bxGroup,
  bxLineChart,
  bxTransfer,
  bxTrendingUp,
} from 'boxicons-quasar';
import { motion } from 'framer-motion';
import Icon from 'modules/shared/Icon';
import { useEffect, useRef, useState } from 'react';
import type { TokenUpdateResolution } from 'services/grpc/tokenUpdate';
import { compressByLabel } from 'utils/numbers';
import { useUnifiedCoinDetails } from '../../lib';

// Market cap color logic from trench token cards
const getMarketCapColor = (mc: number): string => {
  if (mc <= 30_000) return '#0edcdc'; // Blue/cyan for MC <= $30k
  if (mc <= 150_000) return '#f3d525'; // Gold/yellow for MC <= $150k
  return '#00ffa3'; // Green for MC > $150k
};

const formatCompact = (num: number, prefix = '$') => {
  const { value, label } = compressByLabel(num);
  // Ensure 1 decimal place
  const numValue = Number.parseFloat(value);
  const formattedValue = numValue.toFixed(1);
  return `${prefix}${formattedValue}${label}`;
};

const getResolutionLabel = (resolution: TokenUpdateResolution): string => {
  const labels: Record<TokenUpdateResolution, string> = {
    '1m': '1m',
    '5m': '5m',
    '15m': '15m',
    '1h': '1h',
    '6h': '6h',
    '1d': '1d',
    'all-time': 'All',
  };
  return labels[resolution];
};

interface MobileStatsBarProps {
  volumeResolution: TokenUpdateResolution;
  onVolumeCycle: () => void;
  onVolumeSwipe: (direction: 'next' | 'prev') => void;
  volumeData?: {
    buyVolume: number;
    sellVolume: number;
    numBuys: number;
    numSells: number;
  };
  isVolumeLoading?: boolean;
}

export function MobileStatsBar({
  volumeResolution,
  onVolumeCycle,
  onVolumeSwipe,
  volumeData,
  isVolumeLoading = false,
}: MobileStatsBarProps) {
  const { marketData, validatedData } = useUnifiedCoinDetails();

  const totalVolume = volumeData
    ? volumeData.buyVolume + volumeData.sellVolume
    : 0;

  // Track volume changes for animation trigger
  const lastAnimatedVolume = useRef(totalVolume);
  const [volumeAnimationKey, setVolumeAnimationKey] = useState(0);

  useEffect(() => {
    const volumeIncrease = totalVolume - lastAnimatedVolume.current;
    // Only animate when volume increases by $50,000 or more
    if (volumeIncrease >= 50_000) {
      lastAnimatedVolume.current = totalVolume;
      setVolumeAnimationKey(prev => prev + 1);
    }
  }, [totalVolume]);

  const handleDragEnd = (_event: any, info: any) => {
    const swipeThreshold = 30; // Minimum drag distance to trigger swipe
    const { offset } = info;

    if (Math.abs(offset.x) > swipeThreshold) {
      if (offset.x > 0) {
        // Swiped right → previous
        onVolumeSwipe('prev');
      } else {
        // Swiped left → next
        onVolumeSwipe('next');
      }
    }
  };

  const mcValue = marketData.marketCap ?? 0;
  const mcColor = getMarketCapColor(mcValue);
  const bcPercent = (marketData.boundingCurve ?? 0) * 100;

  // Hide BC for migrated tokens (100% bonding curve)
  const isMigrated =
    marketData.boundingCurve !== null && marketData.boundingCurve >= 0.99;

  // Volume color logic for 5-minute timeframe
  const getVolumeColor = (
    volume: number,
    resolution: TokenUpdateResolution,
  ): string => {
    // Only apply color logic for 5m timeframe
    if (resolution !== '5m') return 'text-purple-400';

    if (volume < 15_000) return 'text-blue-400';
    if (volume >= 15_000 && volume < 35_000) return 'text-yellow-400';
    if (volume >= 50_000 && volume < 100_000) return 'text-green-400';
    if (volume >= 100_000) return 'text-purple-400';

    // Between 35k-50k, default to purple
    return 'text-purple-400';
  };

  const volumeColor = getVolumeColor(totalVolume, volumeResolution);

  // Calculate buy/sell ratio
  const buySellRatio =
    volumeData && volumeData.numSells > 0
      ? volumeData.numBuys / volumeData.numSells
      : 0;

  // Determine ratio color (>1 = more buys = green, <1 = more sells = red, =1 = neutral)
  const getRatioColor = (ratio: number): string => {
    if (ratio > 1.2) return 'text-green-400';
    if (ratio < 0.8) return 'text-red-400';
    return 'text-yellow-400';
  };

  return (
    <div
      className={`flex items-center ${isMigrated ? 'justify-around' : 'justify-between'} gap-3 border-v1-border-tertiary border-b bg-v1-background-primary px-3 py-2.5`}
    >
      {/* Market Cap */}
      <div className="flex flex-col items-start gap-0.5">
        <div className="flex items-center gap-1">
          <Icon className="text-white" name={bxCoin} size={12} />
          <span className="font-medium text-[9px] text-white uppercase">
            MC
          </span>
        </div>
        <span
          className="font-bold font-mono text-sm leading-none"
          style={{ color: mcColor }}
        >
          {formatCompact(mcValue)}
        </span>
      </div>

      {/* Volume (Interactive) */}
      <motion.div
        className="flex cursor-pointer flex-col items-start gap-0.5 transition-opacity active:opacity-70"
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.3}
        dragMomentum={false}
        onClick={onVolumeCycle}
        onDragEnd={handleDragEnd}
      >
        <div className="flex items-center gap-1">
          <Icon className="text-white" name={bxTrendingUp} size={12} />
          <span className="font-medium text-[9px] text-white uppercase">V</span>
          <motion.span
            animate={{ scale: 1 }}
            className={`font-medium text-[8px] ${
              volumeResolution === 'all-time'
                ? 'text-neutral-600'
                : 'text-v1-content-brand'
            }`}
            initial={{ scale: 0.9 }}
            key={volumeResolution}
            transition={{ duration: 0.2 }}
          >
            {getResolutionLabel(volumeResolution)}
          </motion.span>
        </div>
        <motion.span
          animate={{ opacity: 1, scale: 1 }}
          className={`font-bold font-mono ${volumeColor} text-sm leading-none ${
            isVolumeLoading ? 'opacity-50' : ''
          }`}
          initial={{ opacity: 0.7, scale: 0.95 }}
          key={volumeAnimationKey}
          transition={{ duration: 0.3 }}
        >
          {formatCompact(totalVolume)}
        </motion.span>
      </motion.div>

      {/* Buy/Sell Ratio */}
      <div className="flex flex-col items-start gap-0.5">
        <div className="flex items-center gap-1">
          <Icon className="text-white" name={bxTransfer} size={12} />
          <span className="font-medium text-[9px] text-white uppercase">
            B/S
          </span>
        </div>
        <div className="flex items-baseline gap-1">
          <span
            className={`font-bold font-mono text-sm leading-none ${getRatioColor(buySellRatio)}`}
          >
            {buySellRatio > 0 ? buySellRatio.toFixed(2) : '0.00'}
          </span>
          <span className="font-mono text-[8px] text-neutral-600 leading-none">
            {formatCompact(volumeData?.buyVolume ?? 0)}/
            {formatCompact(volumeData?.sellVolume ?? 0)}
          </span>
        </div>
      </div>

      {/* Holders */}
      <div className="flex flex-col items-start gap-0.5">
        <div className="flex items-center gap-1">
          <Icon className="text-white" name={bxGroup} size={12} />
          <span className="font-medium text-[9px] text-white uppercase">H</span>
        </div>
        <span className="font-bold font-mono text-sm text-white leading-none">
          {formatCompact(validatedData?.numberOfHolders ?? 0, '')}
        </span>
      </div>

      {/* Bonding Curve - Only show for non-migrated tokens */}
      {!isMigrated && (
        <div className="flex flex-col items-start gap-0.5">
          <div className="flex items-center gap-1">
            <Icon className="text-neutral-500" name={bxLineChart} size={12} />
            <span className="font-medium text-[9px] text-neutral-500 uppercase">
              BC
            </span>
          </div>
          <span
            className={`font-bold font-mono text-sm leading-none ${
              bcPercent < 50
                ? 'text-red-400'
                : bcPercent < 80
                  ? 'text-yellow-400'
                  : 'text-green-400'
            }`}
          >
            {bcPercent.toFixed(1)}%
          </span>
        </div>
      )}
    </div>
  );
}
