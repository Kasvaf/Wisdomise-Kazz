/* eslint-disable import/max-dependencies */
import { Fragment, useMemo } from 'react';
import { type ColumnType } from 'antd/es/table';
import { clsx } from 'clsx';
import { Trans, useTranslation } from 'react-i18next';
import { OverviewWidget } from 'shared/OverviewWidget';
import Table, { useTableState } from 'shared/Table';
import { Coin } from 'shared/Coin';
import {
  type CoinSignal,
  useCoinSignals,
  useHasFlag,
  useMarketInfoFromSignals,
} from 'api';
import { SignalSentiment } from 'modules/insight/coinRadar/PageCoinRadar/components/SignalSentiment';
import { AccessShield } from 'shared/AccessShield';
import { formatNumber } from 'utils/numbers';
import { CoinLabels } from 'shared/CoinLabels';
import { useEmbedView } from 'modules/embedded/useEmbedView';
import { DebugPin } from 'shared/DebugPin';
import { CoinPriceInfo } from '../CoinPriceInfo';
import { CoinWhalesDetails } from '../CoinWhalesDetails';
import { CoinSearchInput } from '../CoinSearchInput';
import { CoinMarketCap } from '../CoinMarketCap/index';
import CoinRadarAlerButton from '../CoinRadarAlertButton';
import { type SocialRadarTableParams } from '../types';
import { SocialRadarFilters } from '../SocialRadarFilters';
import { ReactComponent as Logo } from './logo.svg';
import SocialRadarIcon from './social-radar.png';
import { ReactComponent as Realtime } from './realtime.svg';

export function HotCoinsWidget({ className }: { className?: string }) {
  const marketInfo = useMarketInfoFromSignals();
  const { isEmbeddedView } = useEmbedView();
  const hasFlag = useHasFlag();
  const { t } = useTranslation('coin-radar');
  const [tableProps, tableState, setTableState] =
    useTableState<SocialRadarTableParams>('', {
      page: 1,
      pageSize: 10,
      sortBy: 'rank',
      sortOrder: 'ascending',
      query: '',
      categories: [] as string[],
      networks: [] as string[],
      trendLabels: [] as string[],
      securityLabels: [] as string[],
      exchanges: [] as string[],
      sources: [] as string[],
      windowHours: 24,
    });

  const coins = useCoinSignals(tableState);

  const columns = useMemo<Array<ColumnType<CoinSignal>>>(
    () => [
      {
        fixed: 'left',
        title: t('social-radar.table.rank'),
        render: (_, row) => row.rank,
        width: 50,
      },
      {
        title: t('social-radar.table.name'),
        render: (_, row) => <Coin coin={row.symbol} nonLink={isEmbeddedView} />,
        width: 200,
      },
      {
        colSpan: hasFlag('/coin-radar/social-radar?side-suggestion') ? 1 : 0,
        title: [
          <span
            key="1"
            className="flex items-center gap-1 text-v1-content-primary"
          >
            <DebugPin
              title="/coin-radar/social-radar?side-suggestion"
              color="orange"
            />
            <Logo className="inline-block size-4 grayscale" />
            {t('social-radar.table.sentiment.title')}
          </span>,
          <Fragment key="2">
            <Trans
              ns="coin-radar"
              i18nKey="social-radar.table.sentiment.info"
            />
          </Fragment>,
        ],
        width: 310,
        render: (_, row) => <SignalSentiment signal={row} hidePnl />,
      },
      {
        title: [
          t('social-radar.table.market_cap.title'),
          t('social-radar.table.market_cap.info'),
        ],
        width: 140,
        render: (_, row) => (
          <CoinMarketCap marketData={row.symbol_market_data} />
        ),
      },
      {
        title: [
          t('social-radar.table.price_info.title'),
          <div
            key="2"
            className="[&_b]:font-medium [&_p]:text-xs [&_p]:text-v1-content-secondary"
          >
            <Trans
              ns="coin-radar"
              i18nKey="social-radar.table.price_info.info"
            />
          </div>,
        ],
        width: 240,
        render: (_, row) => (
          <CoinPriceInfo marketData={row.symbol_market_data} />
        ),
      },
      {
        colSpan: hasFlag('/coin-radar/social-radar?whale') ? 1 : 0,
        title: [
          <>
            <DebugPin title="/coin-radar/social-radar?whale" color="orange" />
            {t('social-radar.table.whale_buy_sell.title')}
          </>,
          <Fragment key="2">
            <Trans
              ns="coin-radar"
              i18nKey="social-radar.table.whale_buy_sell.info"
            />
          </Fragment>,
        ],
        width: 190,
        render: (_, row) => (
          <CoinWhalesDetails holdersData={row.holders_data} />
        ),
      },
      {
        title: t('social-radar.table.labels.title'),
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
    [hasFlag, isEmbeddedView, t],
  );

  return (
    <OverviewWidget
      className={clsx(
        'min-h-[670px] shrink-0 xl:min-h-[631px] 2xl:min-h-[640px]',
        className,
      )}
      title={
        isEmbeddedView ? undefined : (
          <>
            <img src={SocialRadarIcon} className="size-[26px]" />
            {t('social-radar.table.title')}
            <Realtime />
          </>
        )
      }
      subtitle={
        isEmbeddedView ? undefined : (
          <div
            className={clsx(
              'w-[450px] mobile:hidden [&_b]:font-normal [&_b]:text-v1-content-primary',
              marketInfo.isLoading && '[&_b]:animate-pulse',
            )}
          >
            <Trans
              ns="coin-radar"
              i18nKey="coin-radar:social-radar.table.description"
              values={{
                posts: formatNumber(
                  marketInfo.data?.analyzed_messages ?? 4000,
                  {
                    compactInteger: true,
                    decimalLength: 0,
                    seperateByComma: true,
                    minifyDecimalRepeats: false,
                  },
                ),
              }}
            />
          </div>
        )
      }
      loading={coins.isInitialLoading}
      empty={(coins.data ?? [])?.length === 0}
      headerClassName="flex flex-wrap"
      headerActions={
        <>
          <div className="flex grow items-center justify-end gap-4 mobile:w-full mobile:justify-between">
            <CoinSearchInput
              value={tableState.query}
              onChange={query => setTableState({ query })}
              className="w-64 mobile:max-w-max mobile:grow"
            />
            {!isEmbeddedView && <CoinRadarAlerButton className="shrink-0" />}
          </div>
          <SocialRadarFilters
            value={tableState}
            onChange={newState => setTableState(newState)}
            className="w-full"
          />
        </>
      }
    >
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
          dataSource={coins.data}
          rowKey={r => JSON.stringify(r.symbol)}
          loading={coins.isRefetching && !coins.isFetched}
          tableLayout="fixed"
          {...tableProps}
        />
      </AccessShield>
    </OverviewWidget>
  );
}
