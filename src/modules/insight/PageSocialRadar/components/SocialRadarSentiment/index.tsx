import { type FC } from 'react';
import { useTranslation } from 'react-i18next';
import { type SocialRadarSentiment as SocialRadarSentimentType } from 'api';
import { ClickableTooltip } from 'shared/ClickableTooltip';
import { MiniBar } from 'shared/MiniBar';
import { CoinPriceChart } from 'shared/CoinPriceChart';
import { type Coin as CoinType, type MiniMarketData } from 'api/types/shared';
import { Coin } from 'shared/Coin';
import { DirectionalNumber } from 'shared/DirectionalNumber';
import { CoinMarketCap } from 'shared/CoinMarketCap';
import { ReadableNumber } from 'shared/ReadableNumber';
import { SRSIcon } from './SRSIcon';
import { SRSSubtitle } from './SRSSubtitle';
import { SRSDetails } from './SRSDetails';
import { SRSTitle } from './SRSTitle';
import { SRSLastMention } from './SRSLastMention';

export const SocialRadarSentiment: FC<{
  value?: SocialRadarSentimentType | null;
  mode: 'default' | 'tiny' | 'mini' | 'expanded' | 'card';
  marketData?: MiniMarketData | null;
  coin?: CoinType | null;
  className?: string;
}> = ({ value, marketData, coin, className, mode }) => {
  const { t } = useTranslation('coin-radar');
  const clickable = (mode === 'default' || mode === 'card') && value;
  return (
    <ClickableTooltip
      chevron={false}
      disabled={!clickable}
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
          {!!value?.signals_analysis?.sparkline?.prices?.length && (
            <CoinPriceChart
              value={value?.signals_analysis?.sparkline?.prices ?? []}
              socialIndexes={value?.signals_analysis?.sparkline?.indexes}
            />
          )}
          <SocialRadarSentiment
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
          <MiniBar value={value?.gauge_measure ?? 0} width={28} height={28} />
          <div className="flex flex-col items-start gap-px whitespace-nowrap">
            <div className="flex items-center justify-start gap-1">
              <SRSIcon
                value={value?.gauge_tag ?? 'NEUTRAL'}
                className="size-[16px] shrink-0"
              />
              <SRSTitle value={value?.gauge_tag} className="text-sm" />
            </div>
            <SRSLastMention value={value} className="text-xs font-light" />
          </div>
        </div>
      )}

      {mode === 'tiny' && (
        <div className="flex items-center gap-1">
          <SRSIcon value={value?.gauge_tag} className="size-[24px] shrink-0" />
          <MiniBar value={value?.gauge_measure ?? 0} />
        </div>
      )}

      {mode === 'mini' && (
        <div className="flex items-center gap-2 whitespace-nowrap">
          <SRSIcon
            value={value?.gauge_tag ?? 'NEUTRAL'}
            className="size-[24px] shrink-0"
          />
          <MiniBar value={value?.gauge_measure ?? 0} />
          <div className="space-y-1">
            <SRSTitle value={value?.gauge_tag} className="shrink-0 text-xs" />
            <SRSLastMention value={value} className="text-[8px] font-light" />
          </div>
        </div>
      )}

      {mode === 'expanded' && (
        <div className="flex h-28 w-full flex-col justify-between gap-2 overflow-hidden rounded-xl p-3 bg-v1-surface-l-next">
          <div className="flex items-center justify-between gap-2">
            <div className="flex h-full flex-col justify-between gap-1">
              <p className="text-xs">{t('call-change.title')}</p>
              <div className="flex items-center justify-start gap-px">
                <SRSIcon
                  value={value?.gauge_tag ?? 'NEUTRAL'}
                  className="size-[20px] shrink-0"
                />
                <SRSTitle value={value?.gauge_tag} className="text-xs" />
                <SRSSubtitle
                  value={value?.gauge_tag}
                  className="ms-1 truncate text-xxs"
                />
              </div>
            </div>
            <MiniBar value={value?.gauge_measure ?? 0} height={28} width={28} />
          </div>
          <SRSDetails
            value={value}
            className="grid-flow-col grid-cols-2 grid-rows-2 text-xs"
          />
        </div>
      )}

      {mode ===
        'card' /* TODO https://www.figma.com/design/ZCTwjDdVzZzR0PwfEmuZZW/Mobile-Experience?node-id=5700-8686&t=8WraowNEXuoxiT7l-0 */ && (
        <div className="flex h-36 w-full flex-col justify-between gap-2 overflow-hidden whitespace-nowrap rounded-xl p-3 bg-v1-surface-l-next">
          <div className="flex max-w-full items-center justify-between gap-2">
            <div className="flex h-full flex-col justify-between gap-1 overflow-hidden">
              <p className="text-xs">{t('call-change.title')}</p>
              <div className="flex items-center justify-start gap-px">
                <SRSIcon
                  value={value?.gauge_tag ?? 'NEUTRAL'}
                  className="size-[20px] shrink-0"
                />
                <SRSTitle value={value?.gauge_tag} className="text-xs" />
                <SRSSubtitle
                  value={value?.gauge_tag}
                  className="ms-1 truncate text-xxs"
                />
              </div>
            </div>
            <MiniBar value={value?.gauge_measure ?? 0} height={28} width={28} />
          </div>
          <SRSDetails value={value} className="grid-cols-1 text-xxs" />
        </div>
      )}
    </ClickableTooltip>
  );
};
