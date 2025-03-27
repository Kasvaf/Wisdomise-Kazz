import { type ReactNode, useMemo } from 'react';
import { type ColumnType } from 'antd/es/table';
import { useTranslation } from 'react-i18next';
import { clsx } from 'clsx';
import { OverviewWidget } from 'shared/OverviewWidget';
import Table, { useTableState } from 'shared/Table';
import { useWhaleRadarCoins, type WhaleRadarCoin } from 'api';
import { Coin } from 'shared/Coin';
import { AccessShield } from 'shared/AccessShield';
import { CoinMarketCap } from 'shared/CoinMarketCap';
import { CoinPriceInfo } from 'shared/CoinPriceInfo';
import { CoinLabels } from 'shared/CoinLabels';
import { SearchInput } from 'shared/SearchInput';
import { useLoadingBadge } from 'shared/LoadingBadge';
import { WhaleCoinBuySellInfo } from '../../WhaleCoinBuySellInfo';
import { WhaleRadarSentiment } from '../../WhaleRadarSentiment';
import { WhaleRadarFilters } from '../../WhaleRadarFilters';
import { ReactComponent as WhaleRadarIcon } from '../../whale-radar.svg';
// eslint-disable-next-line import/max-dependencies
import { ReactComponent as Realtime } from './realtime.svg';

export function WhaleRadarCoinsWidget({
  className,
  headerActions,
}: {
  className?: string;
  headerActions?: ReactNode;
}) {
  const { t } = useTranslation('whale');
  const [tableProps, tableState, setTableState] = useTableState<
    Parameters<typeof useWhaleRadarCoins>[0]
  >('coins', {
    page: 1,
    pageSize: 10,
    sortBy: 'rank',
    sortOrder: 'ascending',
    days: 7,
    categories: [],
    excludeNativeCoins: false,
    profitableOnly: false,
    networks: [],
    query: '',
    securityLabels: [],
    trendLabels: [],
  });
  const coins = useWhaleRadarCoins(tableState);
  useLoadingBadge(coins.isFetching);

  const columns = useMemo<Array<ColumnType<WhaleRadarCoin>>>(
    () => [
      {
        title: t('top_coins.rank'),
        fixed: 'left',
        render: (_, row) => row.rank,
      },
      {
        title: t('top_coins.name'),
        render: (_, row) => <Coin coin={row.symbol} imageClassName="size-6" />,
      },
      {
        title: t('top_coins.wallet_number'),
        render: (_, row) => (
          <WhaleRadarSentiment
            value={row}
            coin={row.symbol}
            marketData={row.data}
            mode="default"
          />
        ),
      },
      {
        title: t('top_coins.market_cap'),
        width: 140,
        render: (_, row) => <CoinMarketCap marketData={row.data} />,
      },
      {
        title: [
          t('top_coins.buy_volume.title'),
          t('top_coins.buy_volume.info'),
        ],
        width: 240,
        render: (_, row) => <CoinPriceInfo marketData={row.data} />,
      },
      {
        title: [
          t('top_coins.buy_volume.title'),
          t('top_coins.buy_volume.info'),
        ],
        render: (_, row) => <WhaleCoinBuySellInfo value={row} type="buy" />,
      },
      {
        title: [
          t('top_coins.sell_volume.title'),
          t('top_coins.sell_volume.info'),
        ],
        render: (_, row) => <WhaleCoinBuySellInfo value={row} type="sell" />,
      },
      {
        title: t('top_coins.labels'),
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
    [t],
  );

  return (
    <OverviewWidget
      className={clsx('min-h-[610px] shrink-0 mobile:min-h-[670px]', className)}
      title={
        <>
          <WhaleRadarIcon className="size-6" />
          {t('top_coins.title')}
          <Realtime />
        </>
      }
      loading={coins.isLoading}
      empty={coins.data?.length === 0}
      headerClassName="flex-wrap"
      headerActions={
        headerActions || (
          <>
            <div className="flex grow items-center justify-end gap-4 mobile:w-full mobile:justify-between">
              <SearchInput
                value={tableState.query}
                onChange={query => setTableState({ query })}
                placeholder={t('coin-radar:common.search_coin')}
                className="w-64 mobile:grow"
                size="md"
              />
            </div>
            <WhaleRadarFilters
              value={tableState}
              onChange={newState => setTableState(newState)}
              className="w-full"
              surface={3}
            />
          </>
        )
      }
    >
      <AccessShield
        mode="table"
        sizes={{
          'guest': true,
          'initial': 3,
          'free': 3,
          'pro': 3,
          'pro+': 3,
          'pro_max': false,
        }}
      >
        <Table
          columns={columns}
          dataSource={coins.data ?? []}
          rowKey={r => JSON.stringify(r.symbol)}
          {...tableProps}
        />
      </AccessShield>
    </OverviewWidget>
  );
}
