import { useTranslation } from 'react-i18next';
import { clsx } from 'clsx';
import { OverviewWidget } from 'shared/OverviewWidget';
import { DebugPin } from 'shared/DebugPin';
import { useTechnicalRadarSentiment } from 'api/market-pulse';
import { SentimentGuage } from './SentimentGuage';

function Progress({ value }: { value: number }) {
  return (
    <div className="relative h-1 w-full max-w-full overflow-hidden rounded bg-v1-background-disabled">
      <div
        className="absolute left-0 top-0 h-full min-w-1 rounded bg-v1-content-positive"
        style={{
          width: `${value * 100}%`,
        }}
      />
    </div>
  );
}

export function TechnicalRadarSentimentWidget({
  className,
  noEmptyState,
  slug,
}: {
  className?: string;
  noEmptyState?: boolean;
  slug: string;
}) {
  const { t } = useTranslation('coin-radar');
  const sentiment = useTechnicalRadarSentiment({ slug });
  const isEmpty =
    !sentiment.isLoading &&
    typeof sentiment.data?.technical_sentiment !== 'string';
  if (noEmptyState && isEmpty) return null;

  return (
    <OverviewWidget
      className={clsx('!p-4', className)}
      loading={sentiment.isLoading}
      contentClassName={clsx(
        'flex flex-row items-center justify-between gap-3 overflow-hidden',
        isEmpty && 'contrast-75 grayscale',
      )}
      overlay={
        <DebugPin
          title="/coin-radar/social-radar?side-suggestion"
          color="orange"
        />
      }
    >
      <div className="flex h-20 grow flex-col justify-between gap-1">
        <p className="text-xxs text-v1-content-primary">
          {t('coin-details.tabs.technical_sentiment.title')}
        </p>
        <div>
          <div className="grid w-full grid-cols-[auto,1fr] items-center gap-x-2 text-[9px] text-white/50">
            <span className="max-w-max">
              {t('coin-details.tabs.technical_sentiment.rsi_overness')}
            </span>
            <Progress
              value={sentiment.data?.rsi_overness_normalized_score ?? 0}
            />

            <span className="max-w-max">
              {t('coin-details.tabs.technical_sentiment.macd_cross')}
            </span>
            <Progress
              value={sentiment.data?.macd_cross_normalized_score ?? 0}
            />

            <span className="max-w-max">
              {t('coin-details.tabs.technical_sentiment.rsi_div')}
            </span>
            <Progress
              value={sentiment.data?.rsi_divergence_normalized_score ?? 0}
            />

            <span className="max-w-max">
              {t('coin-details.tabs.technical_sentiment.macd_div')}
            </span>
            <Progress
              value={sentiment.data?.macd_divergence_normalized_score ?? 0}
            />
          </div>
        </div>
      </div>
      <div className="relative flex h-20 w-[33%] shrink-0 flex-col justify-between overflow-hidden">
        <SentimentGuage
          measure={sentiment.data?.normalized_score ?? 0}
          className="h-16"
        />
        <b
          className={clsx(
            'absolute bottom-0 w-full text-center text-xxs font-bold',
            (sentiment.data?.normalized_score ?? 0) > 0 &&
              'text-v1-content-positive',
            (sentiment.data?.normalized_score ?? 0) < 0 &&
              'text-v1-content-negative',
            (sentiment.data?.normalized_score ?? 0) === 0 &&
              'text-v1-content-notice',
          )}
        >
          {sentiment.data?.technical_sentiment ??
            t('coin-details.tabs.technical_sentiment.empty')}
        </b>
      </div>
    </OverviewWidget>
  );
}
