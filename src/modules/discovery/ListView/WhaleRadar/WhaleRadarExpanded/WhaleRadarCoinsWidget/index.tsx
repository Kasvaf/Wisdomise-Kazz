/* eslint-disable import/max-dependencies */
import { type ReactNode, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { clsx } from 'clsx';
import { OverviewWidget } from 'shared/OverviewWidget';
import { useWhaleRadarCoins, type WhaleRadarCoin } from 'api';
import { Coin } from 'shared/Coin';
import { AccessShield } from 'shared/AccessShield';
import { CoinMarketCap } from 'shared/CoinMarketCap';
import { CoinPriceInfo } from 'shared/CoinPriceInfo';
import { CoinLabels } from 'shared/CoinLabels';
import { SearchInput } from 'shared/SearchInput';
import { useLoadingBadge } from 'shared/LoadingBadge';
import { type TableColumn, Table } from 'shared/v1-components/Table';
import { usePageState } from 'shared/usePageState';
import { RealtimeBadge } from 'modules/discovery/ListView/RealtimeBadge';
import { WhaleCoinBuySellInfo } from '../../WhaleCoinBuySellInfo';
import { WhaleRadarSentiment } from '../../WhaleRadarSentiment';
import { ReactComponent as WhaleRadarIcon } from '../../whale-radar.svg';
import { WhaleRadarFilters } from '../../WhaleRadarFilters';

export function WhaleRadarCoinsWidget({
  className,
  headerActions,
}: {
  className?: string;
  headerActions?: ReactNode;
}) {
  const { t } = useTranslation('whale');
  const [pageState, setPageState] = usePageState<
    Parameters<typeof useWhaleRadarCoins>[0]
  >('whale-radar-coins', {
    sortBy: 'rank',
    sortOrder: 'ascending',
  });
  const coins = useWhaleRadarCoins(pageState);
  useLoadingBadge(coins.isFetching);

  const columns = useMemo<Array<TableColumn<WhaleRadarCoin>>>(
    () => [
      {
        title: t('top_coins.rank'),
        render: row => row.rank,
        width: 64,
      },
      {
        title: t('top_coins.name'),
        sticky: 'start',
        render: row => <Coin coin={row.symbol} imageClassName="size-6" />,
        width: 220,
      },
      {
        title: t('top_coins.wallet_number'),
        width: 130,
        render: row => (
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
        render: row => <CoinMarketCap marketData={row.data} />,
      },
      {
        title: t('top_coins.price'),
        width: 240,
        render: row => <CoinPriceInfo marketData={row.data} />,
      },
      {
        title: t('top_coins.buy_volume.title'),
        info: t('top_coins.buy_volume.info'),
        width: 170,
        render: row => <WhaleCoinBuySellInfo value={row} type="buy" />,
      },
      {
        title: t('top_coins.sell_volume.title'),
        info: t('top_coins.sell_volume.info'),
        width: 170,
        render: row => <WhaleCoinBuySellInfo value={row} type="sell" />,
      },
      {
        title: t('top_coins.labels'),
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
    [t],
  );

  return (
    <OverviewWidget
      className={clsx('min-h-[610px] shrink-0 mobile:min-h-[670px]', className)}
      title={
        <>
          <WhaleRadarIcon className="size-6" />
          {t('top_coins.title')}
        </>
      }
      titleSuffix={<RealtimeBadge />}
      empty={coins.data?.length === 0}
      headerClassName="flex-wrap"
      headerActions={
        headerActions || (
          <>
            <div className="flex grow items-center justify-end gap-4 mobile:w-full mobile:justify-between">
              <SearchInput
                value={pageState.query}
                onChange={query => setPageState(p => ({ ...p, query }))}
                placeholder={t('coin-radar:common.search_coin')}
                className="w-64 mobile:grow"
                size="md"
              />
            </div>
          </>
        )
      }
    >
      <WhaleRadarFilters
        value={pageState}
        onChange={newState =>
          setPageState({ query: pageState.query, ...newState })
        }
        className="mb-4 w-full"
        surface={3}
      />
      <AccessShield
        mode="table"
        sizes={{
          guest: false,
          initial: false,
          free: false,
          vip: false,
        }}
      >
        <Table
          columns={columns}
          loading={coins.isLoading}
          dataSource={coins.data ?? []}
          className="max-h-[470px]"
          rowKey={r => r.symbol.slug}
          scrollable
        />
      </AccessShield>
    </OverviewWidget>
  );
}
