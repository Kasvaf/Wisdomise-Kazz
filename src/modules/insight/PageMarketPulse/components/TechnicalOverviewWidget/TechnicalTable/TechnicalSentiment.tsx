import { clsx } from 'clsx';
import { type FC } from 'react';
import { type TechnicalRadarCoin } from 'api/market-pulse';
import { ConfirmationBadge } from '../../ConfirmationWidget/ConfirmationBadge';

export const TechnicalSentiment: FC<{
  value: TechnicalRadarCoin;
}> = ({ value }) => {
  const isBullish = (value.score ?? 0) > 0;
  return (
    <div>
      <span
        className={clsx(
          'text-sm',
          (value.score ?? 0) > 0
            ? 'text-v1-content-positive'
            : 'text-v1-content-negative',
        )}
      >
        {value.technical_sentiment ?? '--'}
      </span>
      <div className="flex items-center gap-2">
        <ConfirmationBadge
          type={isBullish ? 'rsi_oversold' : 'rsi_overbought'}
          value={value}
          mini
        />
        <ConfirmationBadge
          type={isBullish ? 'rsi_bullish_divergence' : 'rsi_bearish_divergence'}
          value={value}
          mini
        />
        <ConfirmationBadge
          type={isBullish ? 'macd_cross_up' : 'macd_cross_down'}
          value={value}
          mini
        />
        <ConfirmationBadge
          type={
            isBullish ? 'macd_bullish_divergence' : 'macd_bearish_divergence'
          }
          value={value}
          mini
        />
      </div>
    </div>
  );
};
