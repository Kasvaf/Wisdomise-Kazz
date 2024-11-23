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
  const signals = useCoinSignals();
  const hasFlag = useHasFlag();
  const coinSignal = signals.data?.find(signal => signal.symbol.slug === slug);
  if (
    !hasFlag('/coin-radar/social-radar?side-suggestion') ||
    (signals.data && !coinSignal)
  )
    return null;
  return (
    <OverviewWidget className={className} loading={signals.isLoading}>
      <div className="flex items-center justify-between gap-6">
        <div className="flex h-full flex-col justify-between gap-2">
          {coinSignal && (
            <SignalSentiment className="text-sm" signal={coinSignal} minimal />
          )}
        </div>
        {coinSignal && (
          <SentimentGuage
            measure={coinSignal.gauge_measure}
            className="h-[90px]"
          />
        )}
      </div>
    </OverviewWidget>
  );
}
