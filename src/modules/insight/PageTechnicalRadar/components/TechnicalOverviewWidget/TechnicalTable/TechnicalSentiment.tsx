import { clsx } from 'clsx';
import { type FC } from 'react';
import { type MacdConfirmation, type RsiConfirmation } from 'api';
import { ConfirmationBadge } from '../../ConfirmationWidget/ConfirmationBadge';

export const TechnicalSentiment: FC<{
  value: (RsiConfirmation | MacdConfirmation) & {
    score?: null | number; // this and wise_score are the same!
    wise_score?: null | number;
    technical_sentiment?: null | string;
  };
}> = ({ value }) => {
  const score = value.score ?? value.wise_score ?? 0;
  const isGreen = score > 0;
  return (
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
          type={isGreen ? 'rsi_bullish_divergence' : 'rsi_bearish_divergence'}
          value={value}
          mini
        />
        <ConfirmationBadge
          type={isGreen ? 'macd_cross_up' : 'macd_cross_down'}
          value={value}
          mini
        />
        <ConfirmationBadge
          type={isGreen ? 'macd_bullish_divergence' : 'macd_bearish_divergence'}
          value={value}
          mini
        />
      </div>
    </div>
  );
};
