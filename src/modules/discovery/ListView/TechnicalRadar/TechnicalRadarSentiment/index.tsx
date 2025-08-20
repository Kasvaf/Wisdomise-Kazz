import { type FC } from 'react';
import { useTranslation } from 'react-i18next';
import { clsx } from 'clsx';
import {
  type MacdConfirmation,
  type RsiConfirmation,
  type TechnicalRadarSentiment as TechnicalRadarSentimentType,
  type MiniMarketData,
} from 'api/discovery';
import { ClickableTooltip } from 'shared/ClickableTooltip';
import { MiniBar } from 'shared/MiniBar';
import { CoinPriceChart } from 'shared/CoinPriceChart';
import { type Coin as CoinType } from 'api/types/shared';
import { Coin } from 'shared/Coin';
import { DirectionalNumber } from 'shared/DirectionalNumber';
import { CoinMarketCap } from 'shared/CoinMarketCap';
import { ReadableNumber } from 'shared/ReadableNumber';
import { ConfirmationBadge } from '../ConfirmationWidget/ConfirmationBadge';
import { TRSIcon } from './TRSIcon';
import { TRSTitle } from './TRSTitle';
import { useParseTRS } from './useParseTRS';
import { TRSAnalysis } from './TRSAnalysis';

export const TechnicalRadarSentiment: FC<{
  value?:
    | ((RsiConfirmation | MacdConfirmation) & TechnicalRadarSentimentType)
    | null;
  mode: 'default' | 'tiny' | 'mini' | 'expanded' | 'semi_expanded' | 'card';
  marketData?: MiniMarketData | null;
  coin?: CoinType | null;
  className?: string;
  contentClassName?: string;
}> = ({ value, marketData, coin, className, mode, contentClassName }) => {
  const { t } = useTranslation('market-pulse');
  const { isGreen, isBearish, isBullish, isCheap, isExpensive } =
    useParseTRS(value);

  const isEmpty = !isBearish && !isBullish && !isCheap && !isExpensive;
  const clickable = mode === 'default' || mode === 'card';

  if (isEmpty && mode === 'card') return null;

  return (
    <ClickableTooltip
      chevron={false}
      disabled={!clickable || isEmpty}
      title={
        <div className="w-[400px] max-w-full">
          {coin && marketData && (
            <div className="mb-4 flex items-center justify-between gap-4">
              <Coin
                coin={coin}
                imageClassName="size-8"
                nonLink={true}
                truncate={260}
                abbrevationSuffix={
                  <DirectionalNumber
                    className="ms-1"
                    value={marketData?.price_change_percentage_24h}
                    label="%"
                    direction="auto"
                    showIcon
                    showSign={false}
                    format={{
                      decimalLength: 1,
                      minifyDecimalRepeats: true,
                    }}
                  />
                }
              />
              <div className="flex flex-col items-end gap-px">
                <ReadableNumber
                  value={marketData?.current_price}
                  label="$"
                  className="text-sm"
                />
                <CoinMarketCap
                  marketData={marketData}
                  singleLine
                  className="text-xs"
                />
              </div>
            </div>
          )}
          {!!value?.sparkline?.prices?.length && (
            <CoinPriceChart
              className="mb-6 w-full"
              value={value?.sparkline?.prices}
            />
          )}
          <TechnicalRadarSentiment
            value={value}
            mode="expanded"
            className="w-full"
          />
        </div>
      }
      className={className}
    >
      {mode === 'default' && (
        <div className="flex h-11 items-center gap-2">
          <MiniBar
            value={value?.normalized_score ?? 0}
            width={28}
            height={28}
          />
          <div className="inline-block">
            <div className="flex items-center justify-start gap-1">
              {(isBullish || isBearish) && (
                <TRSIcon
                  value={isBullish ? 'bullish' : 'bearish'}
                  className="size-[16px] shrink-0"
                />
              )}
              {(isCheap || isExpensive) && (
                <TRSIcon
                  value={isCheap ? 'cheap' : 'expensive'}
                  className="size-[16px] shrink-0"
                />
              )}
              <TRSTitle
                className="text-sm"
                green={isGreen}
                value={value?.technical_sentiment}
              />
            </div>
            {value && (
              <div className="-mt-px flex items-center gap-2">
                <ConfirmationBadge
                  type={isGreen ? 'rsi_oversold' : 'rsi_overbought'}
                  value={value}
                  mode="icon"
                />
                <ConfirmationBadge
                  type={
                    isGreen
                      ? 'rsi_bullish_divergence'
                      : 'rsi_bearish_divergence'
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
                    isGreen
                      ? 'macd_bullish_divergence'
                      : 'macd_bearish_divergence'
                  }
                  value={value}
                  mode="icon"
                />
              </div>
            )}
          </div>
        </div>
      )}

      {mode === 'tiny' && (
        <div className="flex w-6 min-w-6 flex-col items-center gap-1">
          <TRSIcon
            value={isGreen ? 'bullish' : 'bearish'}
            className="size-6 shrink-0"
          />
          <MiniBar
            value={value?.normalized_score ?? 0}
            width={18}
            height={12}
          />
        </div>
      )}

      {mode === 'mini' && (
        <div className="flex items-center gap-1">
          {(isBullish || isBearish) && (
            <TRSIcon
              value={isBullish ? 'bullish' : 'bearish'}
              className="size-5 shrink-0"
            />
          )}
          {(isCheap || isExpensive) && (
            <TRSIcon
              value={isCheap ? 'cheap' : 'expensive'}
              className="size-5 shrink-0"
            />
          )}
        </div>
      )}

      {(mode === 'expanded' || mode === 'semi_expanded') && (
        <div className="flex w-full flex-col gap-4 overflow-hidden rounded-xl p-3 bg-v1-surface-l-next">
          <div className="flex items-center justify-between gap-2">
            <div>
              <p className="mb-2 text-xs">{t('common.sentiment_title')}</p>
              <div className="flex w-full items-center justify-start gap-2 text-xs">
                {(isBullish || isBearish) && (
                  <TRSIcon
                    value={isBullish ? 'bullish' : 'bearish'}
                    className="size-[24px] shrink-0"
                  />
                )}
                {(isCheap || isExpensive) && (
                  <TRSIcon
                    value={isCheap ? 'cheap' : 'expensive'}
                    className="size-[24px] shrink-0"
                  />
                )}
                <TRSTitle
                  className="grow text-sm"
                  green={isGreen}
                  value={value?.technical_sentiment}
                />
              </div>
            </div>
            <MiniBar
              value={value?.normalized_score ?? 0}
              width={28}
              height={28}
            />
          </div>
          {mode === 'expanded' && (
            <>
              {value && (
                <div className="flex flex-col items-start gap-px">
                  <ConfirmationBadge
                    type={isGreen ? 'rsi_oversold' : 'rsi_overbought'}
                    value={value}
                    mode="expanded"
                  />
                  <ConfirmationBadge
                    type={
                      isGreen
                        ? 'rsi_bullish_divergence'
                        : 'rsi_bearish_divergence'
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
              <TRSAnalysis value={value?.analysis} />
            </>
          )}
        </div>
      )}
      {mode === 'card' && (
        <div
          className={clsx(
            contentClassName,
            'flex h-10 w-full items-center gap-2 overflow-hidden whitespace-nowrap rounded-xl p-3 bg-v1-surface-l-next',
          )}
        >
          {(isBullish || isBearish) && (
            <TRSIcon
              value={isBullish ? 'bullish' : 'bearish'}
              className="size-[18px] shrink-0"
            />
          )}
          {(isCheap || isExpensive) && (
            <TRSIcon
              value={isCheap ? 'cheap' : 'expensive'}
              className="size-[18px] shrink-0"
            />
          )}

          <TRSTitle
            value={value?.technical_sentiment}
            green={isGreen}
            className="max-w-16 grow whitespace-normal text-xs leading-tight"
          />
          <MiniBar
            value={value?.normalized_score ?? 0}
            height={16}
            width={16}
          />
        </div>
      )}
    </ClickableTooltip>
  );
};
