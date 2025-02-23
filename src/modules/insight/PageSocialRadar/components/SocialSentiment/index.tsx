import { type FC } from 'react';
import { useTranslation } from 'react-i18next';
import { type SocialRadarSentiment } from 'api';
import { ClickableTooltip } from 'shared/ClickableTooltip';
import { ReadableDate } from 'shared/ReadableDate';
import { MiniBar } from 'shared/MiniBar';
import { CoinPriceChart } from 'shared/CoinPriceChart';
import { SocialSentimentIcon } from './SocialSentimentIcon';
import { SocialSentimentSubtitle } from './SocialSentimentSubtitle';
import { SocialSentimentDetails } from './SocialSentimentDetails';
import { SocialSentimentTitle } from './SocialSentimentTitle';

export const SocialSentiment: FC<{
  value?: SocialRadarSentiment | null;
  mode?: 'with_tooltip' | 'icon' | 'icon_bar' | 'expanded' | 'summary';
}> = ({ value, mode = 'with_tooltip' }) => {
  const { t } = useTranslation('coin-radar');

  return (
    <>
      {mode === 'with_tooltip' && (
        <ClickableTooltip
          title={
            <div className="flex min-w-[360px] flex-col overflow-hidden mobile:min-w-full">
              <p className="mb-6 text-xs">{t('call-change.title')}</p>
              <div className="mb-6 flex items-center justify-start gap-1">
                <SocialSentimentIcon
                  value={value?.gauge_tag ?? 'NEUTRAL'}
                  className="size-5 shrink-0"
                />
                <SocialSentimentTitle
                  value={value?.gauge_tag}
                  className="text-sm"
                />
                <SocialSentimentSubtitle
                  value={value?.gauge_tag}
                  className="text-sm"
                />
              </div>
              <CoinPriceChart
                className="mb-6 w-full"
                value={value?.signals_analysis?.sparkline?.prices ?? []}
                socialIndexes={value?.signals_analysis?.sparkline?.indexes}
              />
              <SocialSentimentDetails value={value} className="text-xs" />
            </div>
          }
          chevron={false}
        >
          <span className="space-y-[2px] whitespace-nowrap">
            <div className="flex items-center gap-1 text-sm capitalize">
              <SocialSentimentIcon
                value={value?.gauge_tag ?? 'NEUTRAL'}
                className="size-[20px] shrink-0"
              />
              <SocialSentimentTitle
                value={value?.gauge_tag}
                className="shrink-0"
              />
            </div>
            <div className="flex items-center gap-1 ps-[26px] text-xxs">
              <label className="text-v1-content-secondary">
                {t('call-change.last-mention')}:
              </label>
              <ReadableDate
                popup={false}
                value={value?.last_signal_related_at}
              />
            </div>
          </span>
        </ClickableTooltip>
      )}
      {mode === 'summary' && (
        <span className="whitespace-nowrap">
          <div className="flex items-center gap-2">
            <SocialSentimentIcon
              value={value?.gauge_tag ?? 'NEUTRAL'}
              className="size-6 shrink-0"
            />
            <div className="space-y-0">
              <SocialSentimentTitle
                value={value?.gauge_tag}
                className="shrink-0 text-xs"
              />
              <div className="flex items-center gap-1 text-xxs">
                <label className="text-v1-content-secondary">
                  {t('call-change.last-mention')}:
                </label>
                <ReadableDate
                  popup={false}
                  value={value?.last_signal_related_at}
                />
              </div>
            </div>
          </div>
        </span>
      )}
      {mode === 'icon' && (
        <SocialSentimentIcon
          value={value?.gauge_tag}
          className="size-[24px] shrink-0"
        />
      )}
      {mode === 'icon_bar' && (
        <div className="inline-flex items-center gap-1">
          <SocialSentimentIcon
            value={value?.gauge_tag}
            className="size-[24px] shrink-0"
          />
          <MiniBar value={value?.gauge_measure ?? 0} />
        </div>
      )}
      {mode === 'expanded' && (
        <div className="flex flex-col overflow-hidden rounded-xl p-3 bg-v1-surface-l-next">
          <p className="mb-2 text-xs">{t('call-change.title')}</p>
          <div className="mb-2 flex items-center justify-start gap-1">
            <SocialSentimentIcon
              value={value?.gauge_tag ?? 'NEUTRAL'}
              className="size-[20px] shrink-0"
            />
            <SocialSentimentTitle
              value={value?.gauge_tag}
              className="text-sm"
            />
            <SocialSentimentSubtitle
              value={value?.gauge_tag}
              className="text-xs"
            />
          </div>
          <SocialSentimentDetails value={value} className="text-xs" />
        </div>
      )}
    </>
  );
};
