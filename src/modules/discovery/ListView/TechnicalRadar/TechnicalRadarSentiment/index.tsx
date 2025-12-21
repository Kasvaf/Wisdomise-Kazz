import { clsx } from 'clsx';
import type { FC } from 'react';
import { useTranslation } from 'react-i18next';
import type {
  MacdConfirmation,
  MiniMarketData,
  RsiConfirmation,
  TechnicalRadarSentiment as TechnicalRadarSentimentType,
} from 'services/rest/discovery';
import type { Coin as CoinType } from 'services/rest/types/shared';
import { ClickableTooltip } from 'shared/ClickableTooltip';
import { Coin } from 'shared/Coin';
import { CoinMarketCap } from 'shared/CoinMarketCap';
import { CoinPriceChart } from 'shared/CoinPriceChart';
import { DirectionalNumber } from 'shared/DirectionalNumber';
import { MiniBar } from 'shared/MiniBar';
import { ReadableNumber } from 'shared/ReadableNumber';
import { ConfirmationBadge } from '../ConfirmationWidget/ConfirmationBadge';
import { TRSAnalysis } from './TRSAnalysis';
import { TRSIcon } from './TRSIcon';
import { TRSTitle } from './TRSTitle';
import { useParseTRS } from './useParseTRS';

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
      className={className}
      disabled={!clickable || isEmpty}
      title={
        <div className="w-[400px] max-w-full">
          {coin && marketData && (
            <div className="mb-4 flex items-center justify-between gap-4">
              <Coin
                abbrevationSuffix={
                  <DirectionalNumber
                    className="ms-1"
                    direction="auto"
                    format={{
                      decimalLength: 1,
                      minifyDecimalRepeats: true,
                    }}
                    label="%"
                    showIcon
                    showSign={false}
                    value={marketData?.price_change_percentage_24h}
                  />
                }
                coin={coin}
                imageClassName="size-8"
                nonLink={true}
                truncate={260}
              />
              <div className="flex flex-col items-end gap-px">
                <ReadableNumber
                  className="text-sm"
                  label="$"
                  value={marketData?.current_price}
                />
                <CoinMarketCap
                  className="text-xs"
                  marketData={marketData}
                  singleLine
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
            className="w-full"
            mode="expanded"
            value={value}
          />
        </div>
      }
    >
      {mode === 'default' && (
        <div className="flex h-11 items-center gap-2">
          <MiniBar
            height={28}
            value={value?.normalized_score ?? 0}
            width={28}
          />
          <div className="inline-block">
            <div className="flex items-center justify-start gap-1">
              {(isBullish || isBearish) && (
                <TRSIcon
                  className="size-[16px] shrink-0"
                  value={isBullish ? 'bullish' : 'bearish'}
                />
              )}
              {(isCheap || isExpensive) && (
                <TRSIcon
                  className="size-[16px] shrink-0"
                  value={isCheap ? 'cheap' : 'expensive'}
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
                  mode="icon"
                  type={isGreen ? 'rsi_oversold' : 'rsi_overbought'}
                  value={value}
                />
                <ConfirmationBadge
                  mode="icon"
                  type={
                    isGreen
                      ? 'rsi_bullish_divergence'
                      : 'rsi_bearish_divergence'
                  }
                  value={value}
                />
                <ConfirmationBadge
                  mode="icon"
                  type={isGreen ? 'macd_cross_up' : 'macd_cross_down'}
                  value={value}
                />
                <ConfirmationBadge
                  mode="icon"
                  type={
                    isGreen
                      ? 'macd_bullish_divergence'
                      : 'macd_bearish_divergence'
                  }
                  value={value}
                />
              </div>
            )}
          </div>
        </div>
      )}

      {mode === 'tiny' && (
        <div className="flex w-6 min-w-6 flex-col items-center gap-1">
          <TRSIcon
            className="size-6 shrink-0"
            value={isGreen ? 'bullish' : 'bearish'}
          />
          <MiniBar
            height={12}
            value={value?.normalized_score ?? 0}
            width={18}
          />
        </div>
      )}

      {mode === 'mini' && (
        <div className="flex items-center gap-1">
          {(isBullish || isBearish) && (
            <TRSIcon
              className="size-5 shrink-0"
              value={isBullish ? 'bullish' : 'bearish'}
            />
          )}
          {(isCheap || isExpensive) && (
            <TRSIcon
              className="size-5 shrink-0"
              value={isCheap ? 'cheap' : 'expensive'}
            />
          )}
        </div>
      )}

      {(mode === 'expanded' || mode === 'semi_expanded') && (
        <div className="flex w-full flex-col gap-4 overflow-hidden rounded-xl bg-v1-surface-l-next p-3">
          <div className="flex items-center justify-between gap-2">
            <div>
              <p className="mb-2 text-xs">{t('common.sentiment_title')}</p>
              <div className="flex w-full items-center justify-start gap-2 text-xs">
                {(isBullish || isBearish) && (
                  <TRSIcon
                    className="size-[24px] shrink-0"
                    value={isBullish ? 'bullish' : 'bearish'}
                  />
                )}
                {(isCheap || isExpensive) && (
                  <TRSIcon
                    className="size-[24px] shrink-0"
                    value={isCheap ? 'cheap' : 'expensive'}
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
              height={28}
              value={value?.normalized_score ?? 0}
              width={28}
            />
          </div>
          {mode === 'expanded' && (
            <>
              {value && (
                <div className="flex flex-col items-start gap-px">
                  <ConfirmationBadge
                    mode="expanded"
                    type={isGreen ? 'rsi_oversold' : 'rsi_overbought'}
                    value={value}
                  />
                  <ConfirmationBadge
                    mode="expanded"
                    type={
                      isGreen
                        ? 'rsi_bullish_divergence'
                        : 'rsi_bearish_divergence'
                    }
                    value={value}
                  />
                  <ConfirmationBadge
                    mode="expanded"
                    type={isGreen ? 'macd_cross_up' : 'macd_cross_down'}
                    value={value}
                  />
                  <ConfirmationBadge
                    mode="expanded"
                    type={
                      isGreen
                        ? 'macd_bullish_divergence'
                        : 'macd_bearish_divergence'
                    }
                    value={value}
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
            'flex h-10 w-full items-center gap-2 overflow-hidden whitespace-nowrap rounded-xl bg-v1-surface-l-next p-3',
          )}
        >
          {(isBullish || isBearish) && (
            <TRSIcon
              className="size-[18px] shrink-0"
              value={isBullish ? 'bullish' : 'bearish'}
            />
          )}
          {(isCheap || isExpensive) && (
            <TRSIcon
              className="size-[18px] shrink-0"
              value={isCheap ? 'cheap' : 'expensive'}
            />
          )}

          <TRSTitle
            className="max-w-16 grow whitespace-normal text-xs leading-tight"
            green={isGreen}
            value={value?.technical_sentiment}
          />
          <MiniBar
            height={16}
            value={value?.normalized_score ?? 0}
            width={16}
          />
        </div>
      )}
    </ClickableTooltip>
  );
};
