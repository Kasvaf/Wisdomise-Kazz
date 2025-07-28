/* eslint-disable import/max-dependencies */
import { useMemo } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Table, type TableColumn } from 'shared/v1-components/Table';
// import { Coin } from 'shared/Coin';
import {
  type CoinRadarCoin,
  useCoinRadarCoins,
  useRadarsMetrics,
} from 'api/discovery';
import { AccessShield } from 'shared/AccessShield';
import { OverviewWidget } from 'shared/OverviewWidget';
import { useLoadingBadge } from 'shared/LoadingBadge';
import { TableRank } from 'shared/TableRank';
import { CoinMarketCap } from 'shared/CoinMarketCap';
import { Coin } from 'shared/v1-components/Coin';
import { EmptySentiment } from '../EmptySentiment';
import { homeSubscriptionsConfig } from '../constants';
import { SocialRadarSentiment } from '../../SocialRadar/SocialRadarSentiment';
import { ConfirmationBadgesInfo } from '../../TechnicalRadar/ConfirmationWidget/ConfirmationBadge/ConfirmationBadgesInfo';
import { TechnicalRadarSentiment } from '../../TechnicalRadar/TechnicalRadarSentiment';
import { WinRateBadge } from '../../WinRateBadge';
import useHotCoinsTour from '../useHotCoinsTour';
import { ReactComponent as SocialRadarIcon } from './social_radar.svg';
import { ReactComponent as TechnicalRadarIcon } from './technical_radar.svg';
import { ReactComponent as Logo } from './logo.svg';

export function CoinRadarExpanded({ className }: { className?: string }) {
  const { t } = useTranslation('insight');

  const coins = useCoinRadarCoins({});
  const metrics = useRadarsMetrics();
  const metricNumber =
    ((metrics.data?.social_radar.max_average_win_rate ?? 0) +
      (metrics.data?.technical_radar.max_average_win_rate ?? 0)) /
    2;
  useLoadingBadge(coins.isFetching);
  const columns = useMemo<Array<TableColumn<CoinRadarCoin>>>(
    () => [
      {
        title: t('table.rank'),
        key: 'rank',
        render: row => (
          <TableRank highlighted={row._highlighted}>{row.rank}</TableRank>
        ),
        width: 64,
      },
      {
        title: t('table.name'),
        sticky: 'start',
        render: row => (
          <Coin
            abbreviation={row.symbol.abbreviation}
            name={row.symbol.name}
            slug={row.symbol.slug}
            logo={row.symbol.logo_url}
            categories={row.symbol.categories}
            labels={row.symbol_labels}
            networks={row.networks}
            security={row.symbol_security?.data}
            truncate={false}
          />
        ),
        width: 220,
      },
      {
        title: t('coin-radar:social-radar.table.market_cap.title'),
        info: t('coin-radar:social-radar.table.market_cap.info'),
        width: 140,
        render: row => <CoinMarketCap marketData={row.market_data} />,
      },
      {
        key: 'social_radar_sentiment',
        title: (
          <span className="flex items-center gap-1">
            <SocialRadarIcon className="inline-block size-4 grayscale" />
            {t('table.social_radar_sentiment')}
          </span>
        ),
        info: (
          <Trans
            ns="coin-radar"
            i18nKey="coin-radar:social-radar.table.sentiment.info"
          />
        ),
        width: 250,
        render: row =>
          row.social_radar_insight ? (
            <SocialRadarSentiment
              value={row.social_radar_insight}
              mode="default"
            />
          ) : (
            <EmptySentiment value="social_radar" />
          ),
      },
      {
        key: 'technical_radar_sentiment',
        title: (
          <span className="flex items-center gap-1">
            <TechnicalRadarIcon className="inline-block size-4 grayscale" />
            {t('table.technical_radar_sentiment')}
          </span>
        ),
        info: <ConfirmationBadgesInfo key="2" />,
        width: 270,
        render: row =>
          row.technical_radar_insight ? (
            <TechnicalRadarSentiment
              value={row.technical_radar_insight}
              mode="default"
            />
          ) : (
            <EmptySentiment value="technical_radar" />
          ),
      },
    ],
    [t],
  );

  useHotCoinsTour({
    enabled: !coins.isLoading,
  });
  return (
    <div className="p-3">
      <OverviewWidget
        title={
          <>
            <Logo className="size-6 shrink-0" />
            {t('base:menu.coin-radar.full-title')}
          </>
        }
        titleSuffix={
          <WinRateBadge value={metricNumber === 0 ? null : metricNumber} />
        }
        className="min-h-[500px]"
      >
        <AccessShield mode="table" sizes={homeSubscriptionsConfig}>
          <Table
            rowClassName="id-tour-row"
            columns={columns}
            dataSource={coins.data?.slice(0, 10)}
            chunkSize={10}
            rowKey={(r, i) => `${r.symbol.slug} ${i}`}
            surface={3}
            className={className}
            scrollable
            loading={coins.isLoading}
          />
        </AccessShield>
      </OverviewWidget>
    </div>
  );
}
