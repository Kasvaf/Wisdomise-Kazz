/* eslint-disable import/max-dependencies */
import { Fragment, useMemo } from 'react';
import { type ColumnType } from 'antd/es/table';
import { Trans, useTranslation } from 'react-i18next';
import Table from 'shared/Table';
import { Coin } from 'shared/Coin';
import { type CoinRadarCoin, useCoinRadarCoins, useHasFlag } from 'api';
import { SocialSentiment } from 'modules/insight/PageSocialRadar/components/SocialSentiment';
import { AccessShield } from 'shared/AccessShield';
import { CoinLabels } from 'shared/CoinLabels';
import { DebugPin } from 'shared/DebugPin';
import { TechnicalSentiment } from 'modules/insight/PageTechnicalRadar/components/TechnicalSentiment';
import { ConfirmationBadgesInfo } from 'modules/insight/PageTechnicalRadar/components/ConfirmationWidget/ConfirmationBadge/ConfirmationBadgesInfo';
import { OverviewWidget } from 'shared/OverviewWidget';
import { EmptySentiment } from '../EmptySentiment';
import { InsightAlertButton } from '../InsightAlertButton';
import { ReactComponent as SocialRadarIcon } from './social_radar.svg';
import { ReactComponent as TechnicalRadarIcon } from './technical_radar.svg';
import { ReactComponent as Logo } from './logo.svg';

export function CoinRadarTable({ className }: { className?: string }) {
  const coins = useCoinRadarCoins({});
  const hasFlag = useHasFlag();
  const { t } = useTranslation('insight');

  const columns = useMemo<Array<ColumnType<CoinRadarCoin>>>(
    () => [
      {
        fixed: 'left',
        title: t('table.rank'),
        key: 'rank',
        render: (_, row) => row.rank,
        width: 50,
      },
      {
        title: t('table.name'),
        render: (_, row) => <Coin coin={row.symbol} />,
        width: 200,
      },
      {
        colSpan: hasFlag('/coin-radar/social-radar?side-suggestion') ? 1 : 0,
        key: 'social_radar_sentiment',
        title: [
          <span key="1" className="flex items-center gap-1">
            <DebugPin
              title="/coin-radar/social-radar?side-suggestion"
              color="orange"
            />
            <SocialRadarIcon className="inline-block size-4 grayscale" />
            {t('table.social_radar_sentiment')}
          </span>,
          <Fragment key="2">
            <Trans
              ns="coin-radar"
              i18nKey="coin-radar:social-radar.table.sentiment.info"
            />
          </Fragment>,
        ],
        width: 310,
        render: (_, row) =>
          row.social_radar_insight ? (
            <SocialSentiment
              value={row.social_radar_insight}
              detailsLevel={3}
            />
          ) : (
            <EmptySentiment value="social_radar" />
          ),
      },
      {
        key: 'technical_radar_sentiment',
        title: [
          <span key="1" className="flex items-center gap-1">
            <TechnicalRadarIcon className="inline-block size-4 grayscale" />
            {t('table.technical_radar_sentiment')}
          </span>,
          <ConfirmationBadgesInfo key="2" />,
        ],
        width: 310,
        render: (_, row) =>
          row.technical_radar_insight ? (
            <TechnicalSentiment value={row.technical_radar_insight} />
          ) : (
            <EmptySentiment value="technical_radar" />
          ),
      },
      {
        title: t('table.labels'),
        className: 'min-h-16 min-w-72',
        render: (_, row) => (
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
          <Logo className="size-7 shrink-0" />
          {t('base:menu.coin-radar.full-title')}
        </>
      }
      headerActions={<InsightAlertButton className="mobile:w-full" />}
      loading={coins.isLoading}
      empty={!coins.data?.length}
      className="min-h-[500px]"
    >
      <AccessShield
        mode="table"
        sizes={{
          'guest': true,
          'free': true,
          'trial': 3,
          'pro': 3,
          'pro+': false,
          'pro_max': false,
        }}
      >
        <Table
          columns={columns}
          dataSource={coins.data?.slice(0, 10) ?? []}
          rowKey={r => JSON.stringify(r.symbol)}
          loading={coins.isRefetching && !coins.isFetched}
          pagination={{
            pageSize: 99,
            hideOnSinglePage: true,
          }}
          surface={2}
          tableLayout="fixed"
          className={className}
        />
      </AccessShield>
    </OverviewWidget>
  );
}
