import { useTranslation } from 'react-i18next';
import { clsx } from 'clsx';
import { useHasFlag, useSocialRadarSentiment } from 'api';
import { OverviewWidget } from 'shared/OverviewWidget';
import { DebugPin } from 'shared/DebugPin';
import { SignalSentiment } from '../../PageSocialRadar/components/SignalSentiment';
import { SentimentGuage } from './SentimentGuage';

export function SocialRadarSentimentWidget({
  className,
  noEmptyState,
  slug,
}: {
  className?: string;
  noEmptyState?: boolean;
  slug: string;
}) {
  const { t } = useTranslation('coin-radar');
  const sentiment = useSocialRadarSentiment({ slug });
  const isEmpty = !sentiment.isLoading && !sentiment.data;
  const hasFlag = useHasFlag();
  if (!hasFlag('/coin-radar/social-radar?side-suggestion')) return null;
  if (noEmptyState && isEmpty) return null;

  return (
    <OverviewWidget
      className={clsx('!p-4', className)}
      loading={sentiment.isLoading}
      contentClassName={clsx(
        'flex flex-row items-center justify-between gap-3 overflow-hidden',
        isEmpty && 'grayscale',
      )}
      overlay={
        <DebugPin
          title="/coin-radar/social-radar?side-suggestion"
          color="orange"
        />
      }
    >
      <div className="flex h-20 flex-col justify-between gap-1 overflow-hidden">
        <p className="text-xxs text-v1-content-primary">
          {t('coin-details.tabs.social_sentiment.title')}
        </p>
        {sentiment.data ? (
          <SignalSentiment
            className="text-sm"
            signal={sentiment.data}
            minimal
          />
        ) : (
          <p className="max-w-52 text-xs">
            {t('coin-details.tabs.social_sentiment.empty')}
          </p>
        )}
      </div>
      <div className="h-20 w-[35%] shrink-0 overflow-hidden">
        <SentimentGuage
          measure={sentiment.data?.gauge_measure ?? 0}
          className="h-full"
        />
      </div>
    </OverviewWidget>
  );
}
