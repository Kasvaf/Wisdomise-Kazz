import { clsx } from 'clsx';
import { useCoinDetails, useHasFlag, useSocialRadarSentiment } from 'api';
import { SocialRadarSentiment } from 'modules/insight/PageSocialRadar/components/SocialRadarSentiment';

export function SocialRadarSentimentWidget({
  noEmptyState,
  slug,
  className,
  contentClassName,
}: {
  noEmptyState?: boolean;
  slug: string;
  className?: string;
  contentClassName?: string;
}) {
  const coin = useCoinDetails({ slug });
  const sentiment = useSocialRadarSentiment({ slug });
  const isEmpty = !sentiment.isLoading && !sentiment.data;
  const hasFlag = useHasFlag();
  if (!hasFlag('/coin-radar/social-radar?side-suggestion')) return null;
  if (noEmptyState && isEmpty) return null;

  return (
    <SocialRadarSentiment
      value={sentiment.data}
      coin={coin.data?.symbol}
      marketData={coin.data?.data}
      mode="card"
      className={clsx(
        (coin.isLoading || sentiment.isLoading) && 'animate-pulse',
        className,
      )}
      contentClassName={contentClassName}
    />
  );
}
