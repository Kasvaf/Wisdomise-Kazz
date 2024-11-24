import { useTranslation } from 'react-i18next';
import { clsx } from 'clsx';
import { useCoinSignals, useHasFlag } from 'api';
import { OverviewWidget } from 'shared/OverviewWidget';
import { SignalSentiment } from '../../../PageCoinRadar/components/SignalSentiment';
import { SentimentGuage } from './SentimentGuage';

export function CoinSocialSentimentWidget({
  className,
  slug,
}: {
  className?: string;
  slug: string;
}) {
  const { t } = useTranslation('coin-radar');
  const signals = useCoinSignals();
  const hasFlag = useHasFlag();
  const coinSignal = signals.data?.find(signal => signal.symbol.slug === slug);
  if (
    !hasFlag('/coin-radar/social-radar?side-suggestion') ||
    (signals.data && !coinSignal)
  )
    return null;
  return (
    <OverviewWidget
      className={clsx('!p-4', className)}
      loading={signals.isLoading}
      contentClassName="overflow-hidden flex flex-row items-center justify-between gap-3"
    >
      <div className="flex h-20 flex-col justify-between gap-1">
        <p className="text-xxs text-v1-content-primary">
          {t('coin-details.tabs.social_sentiment.title')}
        </p>
        {coinSignal && (
          <SignalSentiment className="text-sm" signal={coinSignal} minimal />
        )}
      </div>
      {coinSignal && (
        <div className="h-20 overflow-hidden">
          <SentimentGuage
            measure={coinSignal.gauge_measure}
            className="mt-[5px] h-[80px]"
          />
        </div>
      )}
    </OverviewWidget>
  );
}
