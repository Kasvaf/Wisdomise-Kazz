import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import PageWrapper from 'modules/base/PageWrapper';
import Tabs from 'shared/Tabs';
import { useScrollPointTabs } from './hooks/useScrollPointTabs';
import { ReactComponent as TradingViewIcon } from './components/CoinSocialFeedWidget/images/trading_view.svg';
import { CoinPriceWidget } from './components/CoinPriceWidget';
import { CoinStatsWidget } from './components/CoinStatsWidget';
import { CoinSocialSentimentWidget } from './components/CoinSocialSentimentWidget';
import { CoinPricePerformanceWidget } from './components/CoinPricePerformanceWidget';
import { TopCoinsWidget } from './components/TopCoinsWidget';
import { WhalePopularCoinsWidget } from './components/WhalePopularCoinsWidget';
import { CoinSocialFeedWidget } from './components/CoinSocialFeedWidget';
import { CoinAvailableExchangesWidget } from './components/CoinAvailableExchangesWidget';
import { MostViewedCoinsWidget } from './components/MostViewedCoinsWidget';
import { CoinCandleChartWidget } from './components/CoinCandleChartWidget';
import { PageCoinRadarDetailMeta } from './components/PageCoinRadarDetailMeta';

const TODO_SHOW_CHART = false;

export default function PageCoinRadarDetail() {
  const { t } = useTranslation('coin-radar');
  const { slug } = useParams<{ slug: string }>();
  if (!slug) throw new Error('unexpected');

  const scrollPointTabs = useScrollPointTabs(
    [
      ...(TODO_SHOW_CHART
        ? [
            {
              key: 'coinoverview_chart',
              label: t('coin-details.tabs.chart.label'),
            },
          ]
        : []),
      {
        key: 'coinoverview_socials',
        label: t('coin-details.tabs.socials.label'),
      },
      {
        key: 'coinoverview_exchanges',
        label: t('coin-details.tabs.markets.label'),
      },
      {
        key: 'coinoverview_trading_view',
        label: (
          <div className="inline-flex items-center gap-1">
            <TradingViewIcon className="size-4" />
            {t('coin-details.tabs.trading_view.label')}
          </div>
        ),
      },
    ],
    160,
  );
  return (
    <PageWrapper>
      <PageCoinRadarDetailMeta slug={slug} />
      <div className="relative grid grid-cols-3 gap-6">
        <div className="col-span-1 mobile:col-span-full">
          <div className="sticky top-0 flex flex-col gap-6 mobile:relative">
            <CoinPriceWidget slug={slug} />
            <CoinStatsWidget slug={slug} />
            <CoinSocialSentimentWidget slug={slug} />
            <CoinPricePerformanceWidget slug={slug} />
            <TopCoinsWidget slug={slug} />
            <MostViewedCoinsWidget slug={slug} />
            <WhalePopularCoinsWidget slug={slug} />
          </div>
        </div>
        <div className="col-span-2 flex flex-col gap-6 mobile:col-span-full">
          <Tabs
            className="sticky top-0 z-50 bg-page mobile:hidden"
            {...scrollPointTabs}
          />

          {TODO_SHOW_CHART && (
            <CoinCandleChartWidget slug={slug} id="coinoverview_chart" />
          )}
          <CoinSocialFeedWidget
            id="coinoverview_socials"
            slug={slug}
            socials={['reddit', 'telegram', 'twitter']}
            pageSize={2}
          />
          <CoinAvailableExchangesWidget
            slug={slug}
            id="coinoverview_exchanges"
          />
          <CoinSocialFeedWidget
            id="coinoverview_trading_view"
            slug={slug}
            socials={['trading_view']}
            pageSize={1}
            title={t('coin-details.tabs.trading_view.title')}
            subtitle=""
          />
        </div>
      </div>
    </PageWrapper>
  );
}
