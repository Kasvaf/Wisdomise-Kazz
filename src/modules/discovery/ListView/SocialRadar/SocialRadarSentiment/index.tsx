import { clsx } from 'clsx';
import type { FC } from 'react';
import { useTranslation } from 'react-i18next';
import type {
  MiniMarketData,
  SocialRadarSentiment as SocialRadarSentimentType,
} from 'services/rest/discovery';
import type { Coin as CoinType } from 'services/rest/types/shared';
import { ClickableTooltip } from 'shared/ClickableTooltip';
import { Coin } from 'shared/Coin';
import { CoinMarketCap } from 'shared/CoinMarketCap';
import { CoinPriceChart } from 'shared/CoinPriceChart';
import { DirectionalNumber } from 'shared/DirectionalNumber';
import { MiniBar } from 'shared/MiniBar';
import { ReadableNumber } from 'shared/ReadableNumber';
import { SRSDetails } from './SRSDetails';
import { SRSIcon } from './SRSIcon';
import { SRSLastMention } from './SRSLastMention';
import { SRSSubtitle } from './SRSSubtitle';
import { SRSTitle } from './SRSTitle';

export const SocialRadarSentiment: FC<{
  value?: SocialRadarSentimentType | null;
  mode: 'default' | 'tiny' | 'mini' | 'expanded' | 'card';
  marketData?: MiniMarketData | null;
  coin?: CoinType | null;
  className?: string;
  contentClassName?: string;
}> = ({ value, marketData, coin, className, mode, contentClassName }) => {
  const { t } = useTranslation('coin-radar');
  const clickable = (mode === 'default' || mode === 'card') && value;

  if (mode === 'card' && !value?.gauge_tag) return null;

  return (
    <ClickableTooltip
      chevron={false}
      className={className}
      disabled={!clickable}
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
          {!!value?.signals_analysis?.sparkline?.prices?.length && (
            <CoinPriceChart
              socialIndexes={value?.signals_analysis?.sparkline?.indexes}
              value={value?.signals_analysis?.sparkline?.prices ?? []}
            />
          )}
          <SocialRadarSentiment
            className="w-full"
            mode="expanded"
            value={value}
          />
        </div>
      }
    >
      {mode === 'default' && (
        <div className="flex h-11 items-center gap-2">
          <MiniBar height={28} value={value?.gauge_measure ?? 0} width={28} />
          <div className="flex flex-col items-start gap-px whitespace-nowrap">
            <div className="flex items-center justify-start gap-1">
              <SRSIcon
                className="size-[16px] shrink-0"
                value={value?.gauge_tag ?? 'NEUTRAL'}
              />
              <SRSTitle className="text-sm" value={value?.gauge_tag} />
            </div>
            <SRSLastMention className="font-light text-xs" value={value} />
          </div>
        </div>
      )}

      {mode === 'tiny' && (
        <div className="flex w-6 min-w-6 flex-col items-center gap-1">
          <SRSIcon className="size-6 shrink-0" value={value?.gauge_tag} />
          <MiniBar height={12} value={value?.gauge_measure ?? 0} width={18} />
        </div>
      )}

      {mode === 'mini' && (
        <div className="flex items-center gap-2 whitespace-nowrap">
          <SRSIcon
            className="size-[24px] shrink-0"
            value={value?.gauge_tag ?? 'NEUTRAL'}
          />
          <MiniBar value={value?.gauge_measure ?? 0} />
          <div className="space-y-1">
            <SRSTitle className="shrink-0 text-xs" value={value?.gauge_tag} />
            <SRSLastMention className="font-light text-[8px]" value={value} />
          </div>
        </div>
      )}

      {mode === 'expanded' && (
        <div
          className={clsx(
            'flex h-28 w-full flex-col justify-between gap-2 overflow-hidden rounded-xl bg-v1-surface-l-next p-3',
            contentClassName,
          )}
        >
          <div className="flex items-center justify-between gap-2">
            <div className="flex h-full flex-col justify-between gap-1">
              <p className="text-xs">{t('call-change.title')}</p>
              <div className="flex items-center justify-start gap-px">
                <SRSIcon
                  className="size-[20px] shrink-0"
                  value={value?.gauge_tag ?? 'NEUTRAL'}
                />
                <SRSTitle className="text-xs" value={value?.gauge_tag} />
                <SRSSubtitle
                  className="ms-1 truncate text-xxs"
                  value={value?.gauge_tag}
                />
              </div>
            </div>
            <MiniBar height={28} value={value?.gauge_measure ?? 0} width={28} />
          </div>
          <SRSDetails
            className="grid-flow-col grid-cols-2 grid-rows-2 text-xs"
            value={value}
          />
        </div>
      )}

      {mode === 'card' && (
        <div
          className={clsx(
            contentClassName,
            'flex h-10 w-full items-center gap-2 overflow-hidden whitespace-nowrap rounded-xl bg-v1-surface-l-next p-3',
          )}
        >
          <SRSIcon
            className="size-[18px] shrink-0"
            value={value?.gauge_tag ?? 'NEUTRAL'}
          />
          <SRSTitle className="grow text-xs" value={value?.gauge_tag} />
          <MiniBar height={16} value={value?.gauge_measure ?? 0} width={16} />
        </div>
      )}
    </ClickableTooltip>
  );
};
