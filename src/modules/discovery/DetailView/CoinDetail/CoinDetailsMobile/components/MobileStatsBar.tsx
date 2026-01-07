import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import type { TokenUpdateResolution } from 'services/grpc/tokenUpdate';
import { compressByLabel } from 'utils/numbers';
import { useUnifiedCoinDetails } from '../../lib';

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

  return (
    <div className="flex items-center justify-between gap-2 border-v1-border-tertiary border-b bg-v1-background-primary px-3 py-1.5">
      <div className="flex items-center gap-1">
        <span className="font-medium text-[10px] text-neutral-600">MC</span>
        <span className="font-mono font-semibold text-v1-content-positive text-xs">
          {formatCompact(marketData.marketCap ?? 0)}
        </span>
      </div>
      <motion.div
        className="flex cursor-pointer items-center gap-1 transition-opacity active:opacity-70"
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.3}
        dragMomentum={false}
        onClick={onVolumeCycle}
        onDragEnd={handleDragEnd}
      >
        <span className="font-medium text-[10px] text-neutral-600">V</span>
        <motion.span
          animate={{ scale: 1 }}
          className={`font-medium text-[10px] ${
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
        <motion.span
          animate={{ opacity: 1, scale: 1 }}
          className={`font-mono font-semibold text-white text-xs ${
            isVolumeLoading ? 'opacity-50' : ''
          }`}
          initial={{ opacity: 0.7, scale: 0.95 }}
          key={volumeAnimationKey}
          transition={{ duration: 0.3 }}
        >
          {formatCompact(totalVolume)}
        </motion.span>
      </motion.div>
      <div className="flex items-center gap-1">
        <span className="font-medium text-[10px] text-neutral-600">TS</span>
        <span className="font-mono font-semibold text-white text-xs">
          {formatCompact(marketData.totalSupply ?? 0, '')}
        </span>
      </div>
      <div className="flex items-center gap-1">
        <span className="font-medium text-[10px] text-neutral-600">H</span>
        <span className="font-mono font-semibold text-white text-xs">
          {(validatedData?.numberOfHolders ?? 0).toLocaleString()}
        </span>
      </div>
      <div className="flex items-center gap-1">
        <span className="font-medium text-[10px] text-neutral-600">BC</span>
        <span className="font-mono font-semibold text-white text-xs">
          {((marketData.boundingCurve ?? 0) * 100).toFixed(1)}%
        </span>
      </div>
    </div>
  );
}
