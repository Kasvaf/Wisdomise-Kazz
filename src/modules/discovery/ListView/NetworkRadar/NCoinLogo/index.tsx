/* eslint-disable import/max-dependencies */
import { type FC } from 'react';
import { clsx } from 'clsx';
import { type TrenchStreamResponseResult } from 'api/proto/network_radar';
import { CircularProgress } from 'shared/CircularProgress';
import { CoinLogo } from 'shared/Coin';
import { HoverTooltip } from 'shared/HoverTooltip';
import { calcNCoinBCurveColor } from '../lib';
import pumpFunLogo from './pumpfun.png';

const EXCHANGE_LOGOS = {
  pumpfun: pumpFunLogo,
  PumpSwap: pumpFunLogo,
};

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
      className="absolute bottom-[2px] right-[2px] inline-flex size-4 items-center justify-center rounded-full bg-v1-background-primary text-xxs font-bold leading-[12px] text-v1-content-primary [&_img]:size-[75%]"
      title={value.symbol?.exchange ?? ''}
    >
      {value.symbol?.exchange && value.symbol.exchange in EXCHANGE_LOGOS ? (
        <img src={EXCHANGE_LOGOS[value.symbol.exchange as never]} />
      ) : (
        <>{value.symbol?.exchange.slice(0, 1) ?? ''}</>
      )}
    </HoverTooltip>
  </div>
);
