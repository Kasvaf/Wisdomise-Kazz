/* eslint-disable import/max-dependencies */
import { Fragment, useMemo } from 'react';
import { type ColumnType } from 'antd/es/table';
import { Trans, useTranslation } from 'react-i18next';
import Table, { useTableState } from 'shared/Table';
import { Coin } from 'shared/Coin';
import { type CoinRadarCoin, useCoinRadarCoins, useHasFlag } from 'api';
import { SignalSentiment } from 'modules/insight/coinRadar/PageCoinRadar/components/SignalSentiment';
import { AccessShield } from 'shared/AccessShield';
import { CoinLabels } from 'shared/CoinLabels';
import { DebugPin } from 'shared/DebugPin';

import { TechnicalSentiment } from 'modules/insight/PageMarketPulse/components/TechnicalOverviewWidget/TechnicalTable/TechnicalSentiment';
import { ConfirmationBadgesInfo } from 'modules/insight/PageMarketPulse/components/ConfirmationWidget/ConfirmationBadge/ConfirmationBadgesInfo';
import { EmptySentiment } from '../EmptySentiment';
import { ReactComponent as SocialRadarIcon } from './social_radar.svg';
import { ReactComponent as TechnicalRadarIcon } from './technical_radar.svg';

export function CoinRadarTable({ className }: { className?: string }) {
  const coins = useCoinRadarCoins();
  const hasFlag = useHasFlag();
  const { t } = useTranslation('insight');
  const [tableProps, tableState] = useTableState('', {
    page: 1,
    pageSize: 10,
    sortBy: 'rank',
    sortOrder: 'ascending',
  });

  const data = useMemo(() => {
    if (!coins.data) return [];
    return coins.data.sort((a, b) => {
      if (tableState.sortBy === 'rank') {
        return (
          (a.rank - b.rank) * (tableState.sortOrder === 'ascending' ? 1 : -1)
        );
      }
      if (tableState.sortBy === 'social_radar_sentiment') {
        return (
          ((a.social_radar_insight?.gauge_measure ?? 0) -
            (b.social_radar_insight?.gauge_measure ?? 0)) *
          (tableState.sortOrder === 'ascending' ? -1 : 1)
        );
      }
      if (tableState.sortBy === 'technical_radar_sentiment') {
        return (
          ((a.technical_radar_insight?.wise_score ?? 0) -
            (b.technical_radar_insight?.wise_score ?? 0)) *
          (tableState.sortOrder === 'ascending' ? -1 : 1)
        );
      }
      return 0;
    });
  }, [tableState, coins]);

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
        sorter: true,
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
            <SignalSentiment signal={row.social_radar_insight} />
          ) : (
            <EmptySentiment value="social_radar" />
          ),
      },
      {
        sorter: true,
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
    <AccessShield
      mode="table"
      sizes={{
        'guest': true,
        'trial': 3,
        'free': true,
        'pro': false,
        'pro+': false,
      }}
    >
      <Table
        columns={columns}
        dataSource={data}
        rowKey={r => JSON.stringify(r.symbol)}
        loading={coins.isRefetching && !coins.isFetched}
        tableLayout="fixed"
        {...tableProps}
        className={className}
      />
    </AccessShield>
  );
}
