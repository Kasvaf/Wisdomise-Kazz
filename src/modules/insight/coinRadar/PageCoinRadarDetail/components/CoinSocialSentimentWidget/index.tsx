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
  if (!hasFlag('/coin-radar/social-radar?side-suggestion')) return null;
  return (
    <OverviewWidget
      className={clsx('!p-4', className)}
      loading={signals.isLoading}
      contentClassName={clsx(
        'flex flex-row items-center justify-between gap-3 overflow-hidden',
        !coinSignal && signals.data && 'contrast-75 grayscale',
      )}
    >
      <div className="flex h-20 flex-col justify-between gap-1">
        <p className="text-xxs text-v1-content-primary">
          {t('coin-details.tabs.social_sentiment.title')}
        </p>
        {coinSignal ? (
          <SignalSentiment className="text-sm" signal={coinSignal} minimal />
        ) : (
          <p className="max-w-52 text-sm">
            {t('coin-details.tabs.social_sentiment.empty')}
          </p>
        )}
      </div>
      <div className="h-20 overflow-hidden">
        <SentimentGuage
          measure={coinSignal?.gauge_measure ?? 0}
          className="mt-[5px] h-[80px]"
        />
      </div>
    </OverviewWidget>
  );
}
