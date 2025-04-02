import { clsx } from 'clsx';
import {
  useCoinDetails,
  useSocialRadarSentiment,
  useTechnicalRadarSentiment,
} from 'api';
import { TechnicalRadarSentiment } from 'modules/insight/PageTechnicalRadar/components/TechnicalRadarSentiment';

export function TechnicalRadarSentimentWidget({
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
  const sentiment = useTechnicalRadarSentiment({ slug });
  const socialSentiment = useSocialRadarSentiment({ slug });
  const coin = useCoinDetails({ slug });
  const isEmpty =
    !sentiment.isLoading &&
    typeof sentiment.data?.technical_sentiment !== 'string';
  if (noEmptyState && isEmpty) return null;

  return (
    <TechnicalRadarSentiment
      value={{
        ...sentiment.data,
        sparkline: {
          prices:
            socialSentiment.data?.signals_analysis?.sparkline?.prices ?? [],
        },
      }}
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
