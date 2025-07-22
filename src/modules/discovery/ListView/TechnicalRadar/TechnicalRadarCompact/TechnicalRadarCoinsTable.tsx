/* eslint-disable import/max-dependencies */
import { type FC, useMemo } from 'react';
import { Coin } from 'shared/v1-components/Coin';
import { AccessShield } from 'shared/AccessShield';
import { type TechnicalRadarCoin, useTechnicalRadarCoins } from 'api/discovery';
import { CoinMarketCap } from 'shared/CoinMarketCap';
import { Table, type TableColumn } from 'shared/v1-components/Table';
import { DirectionalNumber } from 'shared/DirectionalNumber';
import { useLoadingBadge } from 'shared/LoadingBadge';
import { TableRank } from 'shared/TableRank';
import { usePageState } from 'shared/usePageState';
import { useDiscoveryRouteMeta } from 'modules/discovery/useDiscoveryRouteMeta';
import { TechnicalRadarSentiment } from '../TechnicalRadarSentiment';
import { TechnicalRadarFilters } from '../TechnicalRadarFilters';

export const TechnicalRadarCoinsTable: FC<{
  onClick?: (coin: TechnicalRadarCoin) => void;
}> = ({ onClick }) => {
  const [pageState, setPageState] = usePageState<
    Parameters<typeof useTechnicalRadarCoins>[0]
  >('social-radar', {
    sortBy: 'rank',
    sortOrder: 'ascending',
  });

  const coins = useTechnicalRadarCoins(pageState);
  useLoadingBadge(coins.isFetching);

  const columns = useMemo<Array<TableColumn<TechnicalRadarCoin>>>(
    () => [
      {
        key: 'rank',
        className: 'max-w-2',
        render: row => <TableRank highlighted={row._highlighted} />,
      },
      {
        key: 'coin',
        render: row => (
          <Coin
            abbreviation={row.symbol.abbreviation}
            // name={row.symbol.name}
            slug={row.symbol.slug}
            logo={row.symbol.logo_url}
            categories={row.symbol.categories}
            labels={row.symbol_labels}
            networks={row.networks}
            security={row.symbol_security?.data}
            extra={
              <>
                <DirectionalNumber
                  value={row.data?.price_change_percentage_24h}
                  label="%"
                  direction="auto"
                  showIcon
                  showSign={false}
                  format={{
                    decimalLength: 1,
                    minifyDecimalRepeats: true,
                  }}
                />
                .
                <CoinMarketCap
                  marketData={row.data}
                  singleLine
                  className="text-xxs"
                />
              </>
            }
          />
        ),
      },
      {
        key: 'sentiment',
        render: row => <TechnicalRadarSentiment value={row} mode="mini" />,
        align: 'end',
      },
    ],
    [],
  );

  const {
    params: { slug: activeSlug },
  } = useDiscoveryRouteMeta();

  return (
    <>
      <TechnicalRadarFilters
        value={pageState}
        onChange={newPageState => setPageState(newPageState)}
        className="mb-4 w-full"
        surface={1}
        mini
      />
      <AccessShield
        mode="table"
        sizes={{
          guest: true,
          initial: true,
          free: true,
          vip: false,
        }}
      >
        <Table
          columns={columns}
          dataSource={coins.data ?? []}
          rowKey={r => r.symbol.slug}
          loading={coins.isLoading}
          surface={2}
          onClick={r => onClick?.(r)}
          isActive={r => r.symbol.slug === activeSlug}
        />
      </AccessShield>
    </>
  );
};
