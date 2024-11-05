import { useTranslation } from 'react-i18next';
import { clsx } from 'clsx';
import { useCoinSignals, useHasFlag } from 'api';
import { SignalSentiment } from 'shared/SignalSentiment';
import { OverviewWidget } from 'shared/OverviewWidget';
import { SentimentGuage } from './SentimentGuage';
import { ReactComponent as Logo } from './logo.svg';

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
      className={clsx('min-h-[400px]', className)}
      loading={signals.isLoading}
      empty={!coinSignal}
    >
      <div className="text-center">
        <Logo className="mx-auto size-4" />
        <p className="mt-3 text-xs">
          {t('coin-details.tabs.social_sentiment.title')}
        </p>
      </div>
      {coinSignal && <SentimentGuage measure={coinSignal.gauge_measure} />}
      <p className="-mt-16 text-center text-xl font-normal">
        {coinSignal && <SignalSentiment signal={coinSignal} />}
      </p>
      <div className="mt-4 text-center font-normal leading-8">
        <p className="text-xs">
          {t('coin-details.tabs.social_sentiment.market_side')}
        </p>
        <p className="text-xxs text-v1-content-secondary">
          {t('coin-details.tabs.social_sentiment.footer')}
        </p>
      </div>
    </OverviewWidget>
  );
}
