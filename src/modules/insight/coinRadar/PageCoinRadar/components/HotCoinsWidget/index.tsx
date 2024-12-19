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
import { AccessSheild } from 'shared/AccessSheild';
import { formatNumber } from 'utils/numbers';
import { CoinLabels } from 'shared/CoinLabels';
import { useEmbedView } from 'modules/embedded/useEmbedView';
import { CoinPriceInfo } from '../CoinPriceInfo';
import { CoinSecurityLabel } from '../../../../../shared/CoinSecurityLabel/index';
import { type SortMode, SortModes } from '../SortModes';
import { CoinWhalesDetails } from '../CoinWhalesDetails';
import { CoinSearchInput } from '../CoinSearchInput';
import { CoinMarketCap } from '../CoinMarketCap/index';
import { NetworkSelect } from '../NetworkSelect';
import { CategoriesSelect } from '../CategoriesSelect';
import CoinRadarAlerButton from '../CoinRadarAlertButton';
import { ReactComponent as Logo } from './logo.svg';

export function HotCoinsWidget({ className }: { className?: string }) {
  const marketInfo = useMarketInfoFromSignals();
  const { isEmbeddedView } = useEmbedView();
  const hasFlag = useHasFlag();
  const { t } = useTranslation('coin-radar');
  const [tableProps, tableState, setTableState] = useTableState('', {
    page: 1,
    pageSize: 10,
    sortBy: 'rank' as SortMode,
    sortOrder: 'ascending',
    query: '',
    category: '',
    network: '',
  });

  const coins = useCoinSignals({
    windowHours: 24,
    network: tableState.network || undefined,
  });
  const filteredCoins = useMemo(() => {
    // const lowercaseQuery = tableState.query.toLowerCase();
    const lowercaseQuery = tableState.query.toLowerCase();
    return (coins.data ?? [])
      .filter(
        row =>
          !lowercaseQuery ||
          `${row.symbol.name ?? ''}${row.symbol.abbreviation ?? ''}${
            row.symbol.slug ?? ''
          }`
            ?.toLowerCase()
            .includes(lowercaseQuery),
      )
      .filter(
        row =>
          !tableState.category ||
          (row.symbol.categories ?? [])
            .map(r => r.slug)
            .includes(tableState.category),
      )
      .sort((a, b) => {
        if (!tableState.sortBy || tableState.sortBy === 'rank') {
          return a.rank - b.rank;
        }
        if (tableState.sortBy === 'call_time') {
          return (
            new Date(b.signals_analysis.call_time ?? Date.now()).getTime() -
            new Date(a.signals_analysis.call_time ?? Date.now()).getTime()
          );
        }
        if (tableState.sortBy === 'price_change') {
          return (
            (b.symbol_market_data.price_change_percentage_24h ?? 0) -
            (a.symbol_market_data.price_change_percentage_24h ?? 0)
          );
        }
        if (tableState.sortBy === 'pnl') {
          return (
            (b.signals_analysis.real_pnl_percentage ?? 0) -
            (a.signals_analysis.real_pnl_percentage ?? 0)
          );
        }
        if (tableState.sortBy === 'market_cap') {
          return (
            (b.symbol_market_data.market_cap ?? 0) -
            (a.symbol_market_data.market_cap ?? 0)
          );
        }
        return a.rank - b.rank;
      });
  }, [coins.data, tableState]);

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
        render: (_, row) => <SignalSentiment signal={row} />,
      },
      {
        title: [
          t('social-radar.table.market_cap.title'),
          <Fragment key="2">
            <Trans
              ns="coin-radar"
              i18nKey="social-radar.table.market_cap.info"
            />
          </Fragment>,
        ],
        width: 140,
        render: (_, row) => (
          <CoinMarketCap marketData={row.symbol_market_data} />
        ),
      },
      {
        title: [
          t('social-radar.table.price_info.title'),
          <Fragment key="2">
            <Trans
              ns="coin-radar"
              i18nKey="social-radar.table.price_info.info"
            />
          </Fragment>,
        ],
        width: 240,
        render: (_, row) => (
          <CoinPriceInfo marketData={row.symbol_market_data} />
        ),
      },
      {
        colSpan: hasFlag('/coin-radar/social-radar?whale') ? 1 : 0,
        title: [
          t('social-radar.table.whale_buy_sell.title'),
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
            suffix={
              <CoinSecurityLabel
                value={row.symbol_security?.data}
                coin={row.symbol}
              />
            }
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
            <Logo />
            {t('social-radar.table.title')}
          </>
        )
      }
      subtitle={
        isEmbeddedView ? undefined : (
          <div
            className={clsx(
              'capitalize [&_b]:font-normal [&_b]:text-v1-content-primary',
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
      headerClassName="flex-wrap !justify-between"
      headerActions={
        <>
          {!isEmbeddedView && <CoinRadarAlerButton className="mobile:w-full" />}
          <div className="flex w-full grow grid-cols-1 flex-wrap justify-start gap-4 mobile:!grid">
            <CoinSearchInput
              value={tableState.query}
              onChange={query => setTableState({ query })}
              className="max-w-52 shrink-0 basis-80 mobile:order-2 mobile:max-w-full mobile:basis-full"
            />
            <NetworkSelect
              value={tableState.network || undefined}
              onChange={network => setTableState({ network })}
              className="mobile:order-3"
            />
            <CategoriesSelect
              value={tableState.category || undefined}
              onChange={category => setTableState({ category })}
              className="mobile:order-4"
            />
            <div className="flex flex-wrap items-center gap-2 mobile:order-5">
              <span className="text-xs mobile:w-full mobile:grow">
                {t('social-radar.table.sort')}:
              </span>
              <SortModes
                value={tableState.sortBy}
                onChange={sortBy => setTableState({ sortBy })}
                className="mobile:w-full"
              />
            </div>

            <div className="grow mobile:hidden" />
          </div>
        </>
      }
    >
      <AccessSheild mode="table" size={3} level={1}>
        <Table
          columns={columns}
          dataSource={filteredCoins}
          rowKey={r => JSON.stringify(r.symbol)}
          loading={coins.isRefetching && !coins.isFetched}
          tableLayout="fixed"
          {...tableProps}
        />
      </AccessSheild>
    </OverviewWidget>
  );
}
