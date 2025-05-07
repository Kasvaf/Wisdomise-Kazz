/* eslint-disable import/max-dependencies */
import { useMemo } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Table, type TableColumn } from 'shared/v1-components/Table';
import { Coin } from 'shared/Coin';
import { type CoinRadarCoin, useCoinRadarCoins, useHasFlag } from 'api';
import { AccessShield } from 'shared/AccessShield';
import { CoinLabels } from 'shared/CoinLabels';
import { DebugPin } from 'shared/DebugPin';
import { ConfirmationBadgesInfo } from 'modules/insight/PageTechnicalRadar/components/ConfirmationWidget/ConfirmationBadge/ConfirmationBadgesInfo';
import { OverviewWidget } from 'shared/OverviewWidget';
import { SocialRadarSentiment } from 'modules/insight/PageSocialRadar/components/SocialRadarSentiment';
import { TechnicalRadarSentiment } from 'modules/insight/PageTechnicalRadar/components/TechnicalRadarSentiment';
import { useLoadingBadge } from 'shared/LoadingBadge';
import { TableRank } from 'shared/TableRank';
import { EmptySentiment } from '../EmptySentiment';
import { homeSubscriptionsConfig } from '../../constants';
import { ReactComponent as SocialRadarIcon } from './social_radar.svg';
import { ReactComponent as TechnicalRadarIcon } from './technical_radar.svg';
import { ReactComponent as Logo } from './logo.svg';

export function CoinRadarTable({ className }: { className?: string }) {
  const hasFlag = useHasFlag();
  const { t } = useTranslation('insight');

  const coins = useCoinRadarCoins({});
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
        render: row => <Coin coin={row.symbol} />,
        width: 220,
      },
      {
        hidden: !hasFlag('/coin-radar/social-radar?side-suggestion'),
        key: 'social_radar_sentiment',
        title: (
          <span className="flex items-center gap-1">
            <DebugPin
              title="/coin-radar/social-radar?side-suggestion"
              color="orange"
            />
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
      {
        title: t('table.labels'),
        render: row => (
          <CoinLabels
            categories={row.symbol.categories}
            labels={row.symbol_labels}
            networks={row.networks}
            security={row.symbol_security?.data}
            coin={row.symbol}
          />
        ),
      },
    ],
    [hasFlag, t],
  );

  return (
    <OverviewWidget
      title={
        <>
          <Logo className="size-6 shrink-0" />
          {t('base:menu.coin-radar.full-title')}
        </>
      }
      className="min-h-[500px]"
    >
      <AccessShield mode="table" sizes={homeSubscriptionsConfig}>
        <Table
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
  );
}
