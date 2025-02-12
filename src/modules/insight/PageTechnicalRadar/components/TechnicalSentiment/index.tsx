import { clsx } from 'clsx';
import { type FC } from 'react';
import {
  type TechnicalRadarSentiment,
  type MacdConfirmation,
  type RsiConfirmation,
} from 'api';
import { MiniBar } from 'shared/MiniBar';
import { ConfirmationBadge } from '../ConfirmationWidget/ConfirmationBadge';
import Bullish from './bullish.png';
import Bearish from './bearish.png';
import Cheap from './cheap.png';
import Expensive from './expensive.png';

export const TechnicalSentiment: FC<{
  value: (RsiConfirmation | MacdConfirmation) & TechnicalRadarSentiment;
  detailsLevel?: 1 | 2 | 3;
}> = ({ value, detailsLevel = 3 }) => {
  const score = value.normalized_score ?? 0;
  const isGreen = score > 0;
  const isBullish = value.technical_sentiment
    ?.toLowerCase()
    .includes('bullish');
  const isCheap = value.technical_sentiment?.toLowerCase().includes('cheap');
  const isBearish = value.technical_sentiment
    ?.toLowerCase()
    .includes('bearish');
  const isExpensive = value.technical_sentiment
    ?.toLowerCase()
    .includes('expensive');

  return (
    <div className="inline-flex items-center gap-1">
      {detailsLevel === 3 && (
        <div>
          <span
            className={clsx(
              'text-sm',
              isGreen ? 'text-v1-content-positive' : 'text-v1-content-negative',
            )}
          >
            {value.technical_sentiment ?? '--'}
          </span>
          <div className="flex items-center gap-2">
            <ConfirmationBadge
              type={isGreen ? 'rsi_oversold' : 'rsi_overbought'}
              value={value}
              mini
            />
            <ConfirmationBadge
              type={
                isGreen ? 'rsi_bullish_divergence' : 'rsi_bearish_divergence'
              }
              value={value}
              mini
            />
            <ConfirmationBadge
              type={isGreen ? 'macd_cross_up' : 'macd_cross_down'}
              value={value}
              mini
            />
            <ConfirmationBadge
              type={
                isGreen ? 'macd_bullish_divergence' : 'macd_bearish_divergence'
              }
              value={value}
              mini
            />
          </div>
        </div>
      )}
      {detailsLevel === 2 && (
        <>
          {(isBullish || isBearish) && (
            <img
              src={isBullish ? Bullish : Bearish}
              className="size-7 shrink-0 object-contain"
            />
          )}
          {(isCheap || isExpensive) && (
            <img
              src={isCheap ? Cheap : Expensive}
              className="size-7 shrink-0 object-contain"
            />
          )}
        </>
      )}
      {detailsLevel === 1 && (
        <>
          <img
            src={isGreen ? Bullish : Bearish}
            className="size-7 shrink-0 object-contain"
          />
          <MiniBar value={score} />
        </>
      )}
    </div>
  );
};
