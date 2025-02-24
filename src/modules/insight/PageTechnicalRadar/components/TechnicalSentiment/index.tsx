import { clsx } from 'clsx';
import { type FC } from 'react';
import { useTranslation } from 'react-i18next';
import {
  type TechnicalRadarSentiment,
  type MacdConfirmation,
  type RsiConfirmation,
} from 'api';
import { Guage } from 'shared/Guage';
import { ConfirmationBadge } from '../ConfirmationWidget/ConfirmationBadge';
import Bullish from './bullish.png';
import Bearish from './bearish.png';
import Cheap from './cheap.png';
import Expensive from './expensive.png';

export const TechnicalSentiment: FC<{
  value: (RsiConfirmation | MacdConfirmation) & TechnicalRadarSentiment;
  mode?:
    | 'icon'
    | 'icon_bar'
    | 'expanded'
    | 'semi_expanded'
    | 'summary'
    | 'with_tooltip';
}> = ({ value, mode = 'with_tooltip' }) => {
  const { t } = useTranslation('market-pulse');
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
  const isGreen = isBullish || isCheap;

  return (
    <>
      {mode === 'with_tooltip' && (
        <div className="inline-block">
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
              mode="icon"
            />
            <ConfirmationBadge
              type={
                isGreen ? 'rsi_bullish_divergence' : 'rsi_bearish_divergence'
              }
              value={value}
              mode="icon"
            />
            <ConfirmationBadge
              type={isGreen ? 'macd_cross_up' : 'macd_cross_down'}
              value={value}
              mode="icon"
            />
            <ConfirmationBadge
              type={
                isGreen ? 'macd_bullish_divergence' : 'macd_bearish_divergence'
              }
              value={value}
              mode="icon"
            />
          </div>
        </div>
      )}
      {mode === 'icon' && (
        <img
          src={isGreen ? Bullish : Bearish}
          className="size-[24px] shrink-0 object-contain"
        />
      )}
      {mode === 'summary' && (
        <div className="flex items-center gap-4">
          {(isBullish || isBearish) && (
            <img
              src={isBullish ? Bullish : Bearish}
              className="size-[24px] shrink-0 object-contain"
            />
          )}
          {(isCheap || isExpensive) && (
            <img
              src={isCheap ? Cheap : Expensive}
              className="size-[24px] shrink-0 object-contain"
            />
          )}
        </div>
      )}
      {(mode === 'expanded' || mode === 'semi_expanded') && (
        <div className="flex flex-col overflow-hidden rounded-xl p-3 bg-v1-surface-l-next">
          <div className="flex items-center justify-between gap-2">
            <div>
              <p className="mb-2 text-xs">{t('common.sentiment_title')}</p>
              <div className="flex items-center justify-start gap-2 text-xs">
                {(isBullish || isBearish) && (
                  <img
                    src={isBullish ? Bullish : Bearish}
                    className="size-[20px] shrink-0 object-contain"
                  />
                )}
                {(isCheap || isExpensive) && (
                  <img
                    src={isCheap ? Cheap : Expensive}
                    className="size-[20px] shrink-0 object-contain"
                  />
                )}
                <span
                  className={clsx(
                    'text-sm',
                    isGreen
                      ? 'text-v1-content-positive'
                      : 'text-v1-content-negative',
                  )}
                >
                  {value.technical_sentiment ?? '--'}
                </span>
              </div>
            </div>
            <Guage measure={value.normalized_score ?? 0} className="h-9" />
          </div>
          {mode === 'expanded' && (
            <div className="mt-4 flex flex-col items-start gap-px">
              <ConfirmationBadge
                type={isGreen ? 'rsi_oversold' : 'rsi_overbought'}
                value={value}
                mode="expanded"
              />
              <ConfirmationBadge
                type={
                  isGreen ? 'rsi_bullish_divergence' : 'rsi_bearish_divergence'
                }
                value={value}
                mode="expanded"
              />
              <ConfirmationBadge
                type={isGreen ? 'macd_cross_up' : 'macd_cross_down'}
                value={value}
                mode="expanded"
              />
              <ConfirmationBadge
                type={
                  isGreen
                    ? 'macd_bullish_divergence'
                    : 'macd_bearish_divergence'
                }
                value={value}
                mode="expanded"
              />
            </div>
          )}
        </div>
      )}
    </>
  );
};
