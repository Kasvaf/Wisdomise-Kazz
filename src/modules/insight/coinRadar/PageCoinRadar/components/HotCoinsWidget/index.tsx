/* eslint-disable import/max-dependencies */
import { Fragment, useMemo, useState } from 'react';
import { type ColumnType } from 'antd/es/table';
import { clsx } from 'clsx';
import { Trans, useTranslation } from 'react-i18next';
import { OverviewWidget } from 'shared/OverviewWidget';
import Table from 'shared/Table';
import { Coin } from 'shared/Coin';
import {
  type CoinSignal,
  useCoinSignals,
  useHasFlag,
  useMarketInfoFromSignals,
} from 'api';
import { SignalSentiment } from 'modules/insight/coinRadar/PageCoinRadar/components/SignalSentiment';
import { ProLocker } from 'shared/ProLocker';
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
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<string | undefined>(undefined);
  const [network, setNetwork] = useState<string | undefined>(undefined);
  const [sort, setSort] = useState<SortMode | undefined>(undefined);
  const coins = useCoinSignals({
    windowHours: 24,
    network,
  });
  const filteredCoins = useMemo(() => {
    const lowercaseQuery = query.toLowerCase();
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
          !category ||
          (row.symbol.categories ?? []).map(r => r.slug).includes(category),
      )
      .sort((a, b) => {
        if (!sort || sort === 'rank') {
          return a.rank - b.rank;
        }
        if (sort === 'call_time') {
          return (
            new Date(b.signals_analysis.call_time ?? Date.now()).getTime() -
            new Date(a.signals_analysis.call_time ?? Date.now()).getTime()
          );
        }
        if (sort === 'price_change') {
          return (
            (b.symbol_market_data.price_change_percentage_24h ?? 0) -
            (a.symbol_market_data.price_change_percentage_24h ?? 0)
          );
        }
        if (sort === 'pnl') {
          return (
            (b.signals_analysis.real_pnl_percentage ?? 0) -
            (a.signals_analysis.real_pnl_percentage ?? 0)
          );
        }
        if (sort === 'market_cap') {
          return (
            (b.symbol_market_data.market_cap ?? 0) -
            (a.symbol_market_data.market_cap ?? 0)
          );
        }
        return a.rank - b.rank;
      });
  }, [query, category, sort, coins.data]);

  const columns = useMemo<Array<ColumnType<CoinSignal>>>(
    () => [
      {
        fixed: 'left',
        title: t('social-radar.table.rank'),
        render: (_, row) => row.rank,
        width: 100,
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
        render: (_, row: CoinSignal) => <SignalSentiment signal={row} />,
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
        render: (_, row: CoinSignal) => (
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
        render: (_, row) => (
          <CoinLabels
            className="min-h-16 min-w-72"
            categories={row.symbol.categories}
            labels={row.symbol_labels}
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
              value={query}
              onChange={setQuery}
              className="max-w-52 shrink-0 basis-80 mobile:order-2 mobile:max-w-full mobile:basis-full"
            />
            <NetworkSelect
              value={network}
              onChange={setNetwork}
              className="mobile:order-3"
            />
            <CategoriesSelect
              value={category}
              onChange={setCategory}
              className="mobile:order-4"
            />
            <div className="flex flex-wrap items-center gap-2 mobile:order-5">
              <span className="text-xs mobile:w-full mobile:grow">
                {t('social-radar.table.sort')}:
              </span>
              <SortModes
                value={sort}
                onChange={setSort}
                className="mobile:w-full"
              />
            </div>

            <div className="grow mobile:hidden" />
          </div>
        </>
      }
    >
      <ProLocker mode="table" size={3}>
        <Table
          columns={columns}
          dataSource={filteredCoins}
          rowKey={r => JSON.stringify(r.symbol)}
          loading={coins.isRefetching && !coins.isFetched}
          tableLayout="fixed"
        />
      </ProLocker>
    </OverviewWidget>
  );
}
