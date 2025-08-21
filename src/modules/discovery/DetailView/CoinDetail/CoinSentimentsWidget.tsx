import {
  useSocialRadarSentiment,
  useTechnicalRadarSentiment,
  useWhaleRadarSentiment,
} from 'api/discovery';
import { clsx } from 'clsx';
import type { FC } from 'react';
import { SocialRadarSentiment } from '../../ListView/SocialRadar/SocialRadarSentiment';
import { TechnicalRadarSentiment } from '../../ListView/TechnicalRadar/TechnicalRadarSentiment';
import { WhaleRadarSentiment } from '../../ListView/WhaleRadar/WhaleRadarSentiment';
import { useUnifiedCoinDetails } from './useUnifiedCoinDetails';

export const CoinSentimentsWidget: FC<{
  slug: string;
  className?: string;
  hr?: boolean;
}> = ({ slug, className, hr }) => {
  const { data, isLoading } = useUnifiedCoinDetails({ slug });
  const technicalRadar = useTechnicalRadarSentiment({ slug });
  const socialRadar = useSocialRadarSentiment({ slug });
  const whaleRadar = useWhaleRadarSentiment({ slug });

  const isEmpty = !technicalRadar.data && !socialRadar.data && !whaleRadar.data;

  if (isEmpty) return null;

  return (
    <>
      <div className={clsx('flex items-center gap-1', className)}>
        <SocialRadarSentiment
          className={clsx(
            (isLoading || socialRadar.isLoading) && 'animate-pulse',
          )}
          coin={data?.symbol}
          marketData={data?.marketData}
          mode="card"
          value={socialRadar.data}
        />

        <TechnicalRadarSentiment
          className={clsx(
            (isLoading || technicalRadar.isLoading) && 'animate-pulse',
          )}
          coin={data?.symbol}
          marketData={data?.marketData}
          mode="card"
          value={{
            ...technicalRadar.data,
            sparkline: {
              prices:
                socialRadar.data?.signals_analysis?.sparkline?.prices ?? [],
            },
          }}
        />

        <WhaleRadarSentiment
          className={clsx(
            (isLoading || whaleRadar.isLoading) && 'animate-pulse',
          )}
          coin={data?.symbol}
          marketData={data?.marketData}
          mode="card"
          value={whaleRadar.data}
        />
      </div>
      {hr && <hr className="border-white/10" />}
    </>
  );
};
