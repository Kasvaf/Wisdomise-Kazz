import { generateTokenLink } from 'modules/discovery/DetailView/CoinDetail/lib';
import { useDiscoveryParams } from 'modules/discovery/lib';
import { type FC, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  type SocialRadarCoin,
  useSocialRadarCoins,
} from 'services/rest/discovery';
import { AccessShield } from 'shared/AccessShield';
import { CoinMarketCap } from 'shared/CoinMarketCap';
import { DirectionalNumber } from 'shared/DirectionalNumber';
import { useLoadingBadge } from 'shared/LoadingBadge';
import { TableRank } from 'shared/TableRank';
import { usePageState } from 'shared/usePageState';
import { Table, type TableColumn } from 'shared/v1-components/Table';
import { Token } from 'shared/v1-components/Token';
import { SocialRadarFilters } from './SocialRadarFilters';
import { SocialRadarSentiment } from './SocialRadarSentiment';

export const SocialRadarCompact: FC<{ focus?: boolean }> = () => {
  const [pageState, setPageState] = usePageState<
    Parameters<typeof useSocialRadarCoins>[0]
  >('social-radar', {
    sortBy: 'rank',
    sortOrder: 'ascending',
  });

  const navigate = useNavigate();

  const coins = useSocialRadarCoins(pageState);

  useLoadingBadge(coins.isFetching);

  const columns = useMemo<Array<TableColumn<SocialRadarCoin>>>(
    () => [
      {
        key: 'rank',
        className: 'max-w-2',
        render: row => <TableRank highlighted={row._highlighted} />,
      },
      {
        key: 'coin',
        render: row => (
          <Token
            abbreviation={row.symbol.abbreviation}
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
                  value={row.symbol_market_data?.price_change_percentage_24h}
                />
                <CoinMarketCap
                  className="text-xxs"
                  marketData={row.symbol_market_data}
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
        render: row => <SocialRadarSentiment mode="tiny" value={row} />,
      },
    ],
    [],
  );

  const params = useDiscoveryParams();
  const activeSlug = params.slugs?.[0];

  return (
    <div className="p-3">
      <SocialRadarFilters
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
          rowKey={r => r.symbol.slug}
          scrollable={false}
          surface={1}
        />
      </AccessShield>
    </div>
  );
};
