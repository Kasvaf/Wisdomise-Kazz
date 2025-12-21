import { clsx } from 'clsx';
import type { FC } from 'react';
import {
  type MiniMarketData,
  useSocialRadarSentiment,
  useTechnicalRadarSentiment,
} from 'services/rest/discovery';
import { SocialRadarSentiment } from '../../ListView/SocialRadar/SocialRadarSentiment';
import { TechnicalRadarSentiment } from '../../ListView/TechnicalRadar/TechnicalRadarSentiment';
import { useUnifiedCoinDetails } from './lib';

export const CoinSentimentsWidget: FC<{
  className?: string;
  hr?: boolean;
}> = ({ className, hr }) => {
  const { symbol, marketData } = useUnifiedCoinDetails();
  const technicalRadar = useTechnicalRadarSentiment({ slug: symbol.slug });
  const socialRadar = useSocialRadarSentiment({ slug: symbol.slug });
  // const whaleRadar = useWhaleRadarSentiment({ slug: symbol.slug });

  const isEmpty =
    !technicalRadar.data && !socialRadar.data /* && !whaleRadar.data*/;

  const coin = {
    ...symbol,
    logo_url: symbol.logo,
  };
  const miniMarketData: MiniMarketData = {
    current_price: marketData.currentPrice,
    market_cap: marketData.marketCap,
  };

  if (isEmpty) return null;

  return (
    <>
      <div className={clsx('flex items-center gap-1', className)}>
        <SocialRadarSentiment
          className={clsx(socialRadar.isLoading && 'animate-pulse')}
          coin={coin}
          marketData={miniMarketData}
          mode="card"
          value={socialRadar.data}
        />

        <TechnicalRadarSentiment
          className={clsx(technicalRadar.isLoading && 'animate-pulse')}
          coin={coin}
          marketData={miniMarketData}
          mode="card"
          value={{
            ...technicalRadar.data,
            sparkline: {
              prices:
                socialRadar.data?.signals_analysis?.sparkline?.prices ?? [],
            },
          }}
        />

        {/* <WhaleRadarSentiment
          className={clsx(whaleRadar.isLoading && 'animate-pulse')}
          coin={coin}
          marketData={miniMarketData}
          mode="card"
          value={whaleRadar.data}
        /> */}
      </div>
      {hr && <hr className="border-white/10" />}
    </>
  );
};
