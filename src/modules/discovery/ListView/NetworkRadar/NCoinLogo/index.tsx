/* eslint-disable import/max-dependencies */
import { type FC } from 'react';
import { clsx } from 'clsx';
import { type TrenchStreamResponseResult } from 'api/proto/network_radar';
import { CircularProgress } from 'shared/CircularProgress';
import { CoinLogo } from 'shared/Coin';
import { HoverTooltip } from 'shared/HoverTooltip';
import { calcNCoinBCurveColor } from '../lib';

export const NCoinLogo: FC<{
  className?: string;
  value: TrenchStreamResponseResult;
}> = ({ className, value }) => (
  <div className={clsx('relative size-[54px]', className)}>
    <CoinLogo
      value={value.symbol?.imageUrl}
      className="!absolute inset-[4px] size-[48px]"
    />
    <CircularProgress
      className="absolute inset-0"
      color={calcNCoinBCurveColor({
        bCurvePercent: (value.networkData?.boundingCurve ?? 0) * 100,
      })}
      size={54}
      strokeWidth={4}
      value={value.networkData?.boundingCurve ?? 0}
    />
    <HoverTooltip
      className="absolute bottom-[2px] right-[2px] size-3 rounded-full bg-v1-background-primary text-center text-xxs font-bold leading-[12px] text-v1-content-primary"
      title={value.symbol?.exchange ?? ''}
    >
      {value.symbol?.exchange.slice(0, 1) ?? ''}
    </HoverTooltip>
  </div>
);
