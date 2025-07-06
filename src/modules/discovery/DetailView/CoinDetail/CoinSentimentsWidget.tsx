import { type FC } from 'react';
import { clsx } from 'clsx';
import {
  useCoinDetails,
  useSocialRadarSentiment,
  useTechnicalRadarSentiment,
  useWhaleRadarSentiment,
} from 'api/discovery';
import { SocialRadarSentiment } from '../../ListView/SocialRadar/SocialRadarSentiment';
import { TechnicalRadarSentiment } from '../../ListView/TechnicalRadar/TechnicalRadarSentiment';
import { WhaleRadarSentiment } from '../../ListView/WhaleRadar/WhaleRadarSentiment';

export const CoinSentimentsWidget: FC<{
  slug: string;
  className?: string;
  hr?: boolean;
}> = ({ slug, className, hr }) => {
  const coin = useCoinDetails({ slug });
  const technicalRadar = useTechnicalRadarSentiment({ slug });
  const socialRadar = useSocialRadarSentiment({ slug });
  const whaleRadar = useWhaleRadarSentiment({ slug });

  const isEmpty = !technicalRadar.data && !socialRadar.data && !whaleRadar.data;

  if (isEmpty) return null;

  return (
    <>
      <div className={clsx('flex items-center gap-1', className)}>
        <SocialRadarSentiment
          value={socialRadar.data}
          coin={coin.data?.symbol}
          marketData={coin.data?.data}
          mode="card"
          className={clsx(
            (coin.isLoading || socialRadar.isLoading) && 'animate-pulse',
          )}
        />

        <TechnicalRadarSentiment
          value={{
            ...technicalRadar.data,
            sparkline: {
              prices:
                socialRadar.data?.signals_analysis?.sparkline?.prices ?? [],
            },
          }}
          coin={coin.data?.symbol}
          marketData={coin.data?.data}
          mode="card"
          className={clsx(
            (coin.isLoading || technicalRadar.isLoading) && 'animate-pulse',
          )}
        />

        <WhaleRadarSentiment
          value={whaleRadar.data}
          coin={coin.data?.symbol}
          marketData={coin.data?.data}
          mode="card"
          className={clsx(
            (coin.isLoading || whaleRadar.isLoading) && 'animate-pulse',
          )}
        />
      </div>
      {hr && <hr className="border-white/10" />}
    </>
  );
};
