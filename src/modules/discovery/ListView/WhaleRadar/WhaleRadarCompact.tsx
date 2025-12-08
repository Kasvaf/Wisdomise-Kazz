import { useWhaleRadarCoins, type WhaleRadarCoin } from 'api/discovery';
import { generateTokenLink } from 'modules/discovery/DetailView/CoinDetail/lib';
import { useDiscoveryParams } from 'modules/discovery/lib';
import { type FC, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { AccessShield } from 'shared/AccessShield';
import { CoinMarketCap } from 'shared/CoinMarketCap';
import { DirectionalNumber } from 'shared/DirectionalNumber';
import { useLoadingBadge } from 'shared/LoadingBadge';
import { usePageState } from 'shared/usePageState';
import { Table, type TableColumn } from 'shared/v1-components/Table';
import { Token } from 'shared/v1-components/Token';
import { WhaleRadarFilters } from './WhaleRadarFilters';
import { WhaleRadarSentiment } from './WhaleRadarSentiment';

export const WhaleRadarCompact: FC<{ focus?: boolean }> = () => {
  const [pageState, setPageState] = usePageState<
    Parameters<typeof useWhaleRadarCoins>[0]
  >('whale-radar-coins', {
    sortBy: 'rank',
    sortOrder: 'ascending',
  });
  const coins = useWhaleRadarCoins(pageState);
  useLoadingBadge(coins.isFetching);

  const navigate = useNavigate();

  const columns = useMemo<Array<TableColumn<WhaleRadarCoin>>>(
    () => [
      {
        key: 'coin',
        render: row => (
          <Token
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
                  className="text-2xs"
                  marketData={row.data}
                  singleLine
                />
              </>
            }
            labels={row.symbol_labels}
            link={false}
            logo={row.symbol.logo_url}
            networks={row.networks}
            slug={row.symbol.slug}
          />
        ),
      },
      {
        key: 'sentiment',
        align: 'end',
        render: row => <WhaleRadarSentiment mode="tiny" value={row} />,
      },
    ],
    [],
  );

  const params = useDiscoveryParams();
  const activeSlug = params.slugs?.[0];

  return (
    <div className="p-3">
      <WhaleRadarFilters
        className="mb-4 w-full"
        mini
        onChange={newPageState => setPageState(newPageState)}
        surface={1}
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
          columns={columns}
          dataSource={coins.data ?? []}
          isActive={r => r.symbol.slug === activeSlug}
          loading={coins.isLoading}
          onClick={r => {
            if (r.networks) {
              navigate(generateTokenLink(r.networks));
            }
          }}
          rowKey={r => JSON.stringify(r.symbol)}
          scrollable={false}
          surface={2}
        />
      </AccessShield>
    </div>
  );
};
