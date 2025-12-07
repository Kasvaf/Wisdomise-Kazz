import { useWhaleRadarCoins, type WhaleRadarCoin } from 'api/discovery';
import { clsx } from 'clsx';
import BtnQuickBuy from 'modules/autoTrader/BuySellTrader/QuickBuy/BtnQuickBuy';
import QuickBuySettings from 'modules/autoTrader/BuySellTrader/QuickBuy/QuickBuySettings';
import { RealtimeBadge } from 'modules/discovery/ListView/RealtimeBadge';
import { type ReactNode, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { AccessShield } from 'shared/AccessShield';
import { CoinMarketCap } from 'shared/CoinMarketCap';
import { CoinPriceInfo } from 'shared/CoinPriceInfo';
import { useLoadingBadge } from 'shared/LoadingBadge';
import { OverviewWidget } from 'shared/OverviewWidget';
import { SearchInput } from 'shared/SearchInput';
import { usePageState } from 'shared/usePageState';
import { Table, type TableColumn } from 'shared/v1-components/Table';
import { Token } from 'shared/v1-components/Token';
import { WhaleCoinBuySellInfo } from '../../WhaleCoinBuySellInfo';
import { WhaleRadarFilters } from '../../WhaleRadarFilters';
import { WhaleRadarSentiment } from '../../WhaleRadarSentiment';
import { ReactComponent as WhaleRadarIcon } from '../../whale-radar.svg';

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
        render: row => (
          <Token
            abbreviation={row.symbol.abbreviation}
            categories={row.symbol.categories}
            labels={row.symbol_labels}
            logo={row.symbol.logo_url}
            name={row.symbol.name}
            networks={row.networks}
            slug={row.symbol.slug}
            truncate={false}
          />
        ),
        width: 220,
      },
      {
        title: t('top_coins.wallet_number'),
        width: 130,
        render: row => (
          <WhaleRadarSentiment
            coin={row.symbol}
            marketData={row.data}
            mode="default"
            value={row}
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
        render: row => <WhaleCoinBuySellInfo type="buy" value={row} />,
      },
      {
        title: t('top_coins.sell_volume.title'),
        info: t('top_coins.sell_volume.info'),
        width: 170,
        render: row => <WhaleCoinBuySellInfo type="sell" value={row} />,
      },
    ],
    [t],
  );

  return (
    <OverviewWidget
      className={clsx('min-h-[610px] shrink-0 max-md:min-h-[670px]', className)}
      empty={coins.data?.length === 0}
      headerActions={
        headerActions || (
          <div className="flex gap-2">
            <QuickBuySettings source="whale_radar" />
            <div className="flex grow items-center justify-end gap-4 max-md:w-full max-md:justify-between">
              <SearchInput
                className="w-64 max-md:grow"
                onChange={query => setPageState(p => ({ ...p, query }))}
                placeholder={t('coin-radar:common.search_coin')}
                size="xs"
                value={pageState.query}
              />
            </div>
          </div>
        )
      }
      headerClassName="flex-wrap"
      title={
        <>
          <WhaleRadarIcon className="size-6" />
          {t('top_coins.title')}
        </>
      }
      titleSuffix={<RealtimeBadge />}
    >
      <WhaleRadarFilters
        className="mb-4 w-full"
        onChange={newState =>
          setPageState({ query: pageState.query, ...newState })
        }
        surface={2}
        value={pageState}
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
          className="max-h-[470px]"
          columns={columns}
          dataSource={coins.data ?? []}
          loading={coins.isLoading}
          rowHoverSuffix={row => (
            <BtnQuickBuy
              networks={row.networks}
              slug={row.symbol.slug}
              source="whale_radar"
            />
          )}
          rowKey={r => r.symbol.slug}
          scrollable
        />
      </AccessShield>
    </OverviewWidget>
  );
}
