/* eslint-disable i18next/no-literal-string */
/* eslint-disable import/max-dependencies */
import { useMemo, useState } from 'react';
import { type ColumnType } from 'antd/es/table';
import { clsx } from 'clsx';
import { bxSearch } from 'boxicons-quasar';
import { OverviewWidget } from 'shared/OverviewWidget';
import Table from 'shared/Table';
import { Coin } from 'shared/Coin';
import { type CoinSignal, useCoinSignals, useHasFlag } from 'api';
import { SignalSentiment } from 'modules/insight/coinRadar/PageCoinRadar/components/SignalSentiment';
import { ProLocker } from 'shared/ProLocker';
import TextBox from 'shared/TextBox';
import Icon from 'shared/Icon';
import { CoinInfo } from '../CoinInfo';
import { CoinCategoriesLabel } from '../CoinCategoriesLabel';
import { CoinSecurityLabel } from '../CoinSecurityLabel/index';
import { CategoriesSelect } from '../CategoriesSelect';
import { type SortMode, SortModes } from '../SortModes';
import SetCoinRadarAlert from '../SetCoinRadarAlert';
import { CoinWhalesDetails } from '../CoinWhalesDetails';
import { ReactComponent as Logo } from './logo.svg';

export function HotCoinsWidget({ className }: { className?: string }) {
  const coins = useCoinSignals({
    windowHours: 24,
  });
  const hasFlag = useHasFlag();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<string | undefined>(undefined);
  const [sort, setSort] = useState<SortMode | undefined>(undefined);

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
          (row.symbol.categories ?? []).map(r => r.name).includes(category),
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
        title: 'Wise Rank' /* NAITODO add info */,
        render: (_, row) => row.rank,
        width: 100,
      },
      {
        title: 'Name' /* NAITODO */,
        render: (_, row) => <Coin coin={row.symbol} />,
        width: 200,
      },
      {
        colSpan: hasFlag('/insight/coin-radar?side-suggestion') ? 1 : 0,
        title: [
          // eslint-disable-next-line react/jsx-key
          <span className="flex items-center gap-1 text-v1-content-primary">
            <Logo className="inline-block size-4 grayscale" />
            {'Wisdomise Sentiment'}
          </span>,
          // NAITODO
          // eslint-disable-next-line react/jsx-key
          <div className="text-xs">
            <b>Wisdomise Sentiment</b>
            <br />
            <br />
            <b>
              Wisdomise AI analyzes social sentiment for each asset (coin or
              token) from Reddit, Telegram, Trading View, X (formerly Twitter),
              and YouTube. The sentiment can be Positive, Neutral, or Negative,
              showing how the community feels.
            </b>
            <br />
            <br />
            <b>P&L % Change</b>
            <br />
            <p>
              Tracks the Profit & Loss from when the asset was first hunted as
              “Hot” until its first major price movement.
            </p>
            <br />
            <br />
            <p>
              This information helps you make informed decisions by seeing not
              just the community’s view but also how market movements align with
              those opinions.
            </p>
          </div>,
        ] /* NAITODO add info */,
        width: 310,
        render: (_, row: CoinSignal) => <SignalSentiment signal={row} />,
      },
      {
        title: 'Info' /* NAITODO add info */,
        width: 310,
        render: (_, row) => (
          <CoinInfo coin={row.symbol} marketData={row.symbol_market_data} />
        ),
      },
      {
        title: [
          'Whale Buy/Sell',
          // NAITODO
          // eslint-disable-next-line react/jsx-key
          <div className="text-xs">
            <b>Whale Buy/Sell</b>
            <br />
            <br />
            <b>Tracks data from Smart Wallets (Whales) using Wisdomise AI:</b>
            <br />
            <br />
            <ul>
              <li>
                <b>Buying Activity:</b> Displays the number of wallets that
                bought the asset in the last hour and the total amount
                purchased.
              </li>
              <br />
              <li>
                <b>Selling Activity:</b> Shows the number of wallets that sold
                the asset in the last hour and the total amount sold.
              </li>
            </ul>
            <br />
            <p>
              For assets that are not attractive to whales and have no
              significant transactions, the badge Untracked is displayed.
            </p>
          </div>,
        ],
        width: 150,
        render: (_, row) => (
          <CoinWhalesDetails holdersData={row.holders_data} />
        ),
      },
      {
        title: 'Labels' /* NAITODO */,
        render: (_, row) => (
          <div className="flex min-h-16 flex-wrap items-center gap-1">
            <CoinCategoriesLabel coin={row.symbol} />
            <CoinSecurityLabel
              value={row.symbol_security?.data}
              coin={row.symbol}
            />
          </div>
        ),
      },
    ],
    [hasFlag],
  );

  return (
    <OverviewWidget
      className={clsx(
        'min-h-[670px] shrink-0 xl:min-h-[631px] 2xl:min-h-[640px]',
        className,
      )}
      title={
        <>
          <Logo />
          {'Wisdomise Hot Coins' /* NAITODO */}
        </>
      }
      subtitle={
        /* NAITODO */
        <div className="mobile:hidden">
          {'Wisdomise Social Radar scanned '}
          <span className="text-v1-content-primary">{'1.49K Posts'}</span>
          {' in the last 24 hours for accurate, data-driven insights.'}
        </div>
      }
      loading={coins.isInitialLoading}
      empty={(coins.data ?? [])?.length === 0}
      headerClassName="flex-wrap !justify-start"
      headerActions={
        <>
          <div className="flex w-full grow grid-cols-1 flex-wrap justify-start gap-4 mobile:!grid">
            <TextBox
              value={query}
              onChange={setQuery}
              placeholder={'Search Coin...' /* NAITODO */}
              className="shrink-0 basis-80 mobile:order-2 mobile:basis-full"
              inputClassName="text-sm"
              suffix={<Icon name={bxSearch} />}
            />
            <CategoriesSelect
              value={category}
              onChange={setCategory}
              className="mobile:order-3"
            />
            <div className="flex flex-wrap items-center gap-2 mobile:order-4">
              <span className="ps-6 text-xs mobile:w-full mobile:grow mobile:ps-0">
                {'Sort: ' /* NAITODO */}
              </span>
              <SortModes
                value={sort}
                onChange={setSort}
                className="mobile:w-full"
              />
            </div>

            <div className="grow mobile:hidden" />
            <SetCoinRadarAlert className="mobile:order-1" />
          </div>
        </>
      }
    >
      <ProLocker mode="table" level={3}>
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
