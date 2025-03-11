import { clsx } from 'clsx';
import { useCoinDetails, useHasFlag, useWhaleRadarSentiment } from 'api';
import { WhaleRadarSentiment } from 'modules/insight/PageWhaleRadar/components/WhaleRadarSentiment';

export function WhaleRadarSentimentWidget({
  slug,
  className,
}: {
  slug: string;
  className?: string;
}) {
  const coin = useCoinDetails({ slug });
  const sentiment = useWhaleRadarSentiment({ slug });
  const hasFlag = useHasFlag();
  if (!hasFlag('/coin-radar/social-radar?whale')) return null;
  return (
    <WhaleRadarSentiment
      value={sentiment.data}
      coin={coin.data?.symbol}
      marketData={coin.data?.data}
      mode="card"
      className={clsx(
        (coin.isLoading || sentiment.isLoading) && 'animate-pulse',
        className,
      )}
    />
  );
}
