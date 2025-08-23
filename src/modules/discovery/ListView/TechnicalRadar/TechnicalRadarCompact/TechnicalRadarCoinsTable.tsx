import { type TechnicalRadarCoin, useTechnicalRadarCoins } from 'api/discovery';
import { useDiscoveryParams } from 'modules/discovery/lib';
import { type FC, useMemo } from 'react';
import { AccessShield } from 'shared/AccessShield';
import { CoinMarketCap } from 'shared/CoinMarketCap';
import { DirectionalNumber } from 'shared/DirectionalNumber';
import { useLoadingBadge } from 'shared/LoadingBadge';
import { TableRank } from 'shared/TableRank';
import { usePageState } from 'shared/usePageState';
import { Coin } from 'shared/v1-components/Coin';
import { Table, type TableColumn } from 'shared/v1-components/Table';
import { TechnicalRadarFilters } from '../TechnicalRadarFilters';
import { TechnicalRadarSentiment } from '../TechnicalRadarSentiment';

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
            categories={row.symbol.categories}
            extra={
              <>
                <DirectionalNumber
                  direction="auto"
                  format={{
                    decimalLength: 1,
                    minifyDecimalRepeats: true,
                  }}
                  label="%"
                  showIcon
                  showSign={false}
                  value={row.data?.price_change_percentage_24h}
                />
                <CoinMarketCap
                  className="text-xxs"
                  marketData={row.data}
                  singleLine
                />
              </>
            }
            href={false}
            labels={row.symbol_labels}
            logo={row.symbol.logo_url}
            networks={row.networks}
            security={row.symbol_security?.data}
            slug={row.symbol.slug}
          />
        ),
      },
      {
        key: 'sentiment',
        render: row => <TechnicalRadarSentiment mode="mini" value={row} />,
        align: 'end',
      },
    ],
    [],
  );

  const params = useDiscoveryParams();
  const activeSlug = params.slugs?.[0];

  return (
    <>
      <TechnicalRadarFilters
        className="mb-4 w-full"
        mini
        onChange={newPageState => setPageState(newPageState)}
        surface={1}
        value={pageState}
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
          isActive={r => r.symbol.slug === activeSlug}
          loading={coins.isLoading}
          onClick={r => onClick?.(r)}
          rowKey={r => r.symbol.slug}
          surface={1}
        />
      </AccessShield>
    </>
  );
};
