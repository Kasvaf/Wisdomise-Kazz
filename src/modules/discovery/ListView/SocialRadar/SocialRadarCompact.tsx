import { type SocialRadarCoin, useSocialRadarCoins } from 'api/discovery';
import { useDiscoveryParams } from 'modules/discovery/lib';
import { type FC, useMemo } from 'react';
import { AccessShield } from 'shared/AccessShield';
import { CoinMarketCap } from 'shared/CoinMarketCap';
import { CoinPriceChart } from 'shared/CoinPriceChart';
import { DirectionalNumber } from 'shared/DirectionalNumber';
import { useLoadingBadge } from 'shared/LoadingBadge';
import { TableRank } from 'shared/TableRank';
import { useGlobalNetwork } from 'shared/useGlobalNetwork';
import { usePageState } from 'shared/usePageState';
import { Coin } from 'shared/v1-components/Coin';
import { Table, type TableColumn } from 'shared/v1-components/Table';
import {
  CoinPreDetailModal,
  useCoinPreDetailModal,
} from '../CoinPreDetailModal';
import { SocialRadarFilters } from './SocialRadarFilters';
import { SocialRadarSentiment } from './SocialRadarSentiment';
import SocialRadarSharingModal from './SocialRadarSharingModal';

export const SocialRadarCompact: FC<{ focus?: boolean }> = ({ focus }) => {
  const [pageState, setPageState] = usePageState<
    Parameters<typeof useSocialRadarCoins>[0]
  >('social-radar', {
    sortBy: 'rank',
    sortOrder: 'ascending',
  });
  const [globalNetwork] = useGlobalNetwork();

  const [openModal, { closeModal, isModalOpen, selectedRow }] =
    useCoinPreDetailModal<SocialRadarCoin>({
      directNavigate: !focus,
      slug: r => {
        const contractAddress = r.networks?.find(
          x => x.network.slug === globalNetwork,
        )?.contract_address;
        return {
          slug: r.symbol.slug,
          network: globalNetwork,
          contractAddress,
        };
      },
    });

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
                  value={row.symbol_market_data?.price_change_percentage_24h}
                />
                <CoinMarketCap
                  className="text-xxs"
                  marketData={row.symbol_market_data}
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
          onClick={r => openModal(r)}
          rowKey={r => r.symbol.slug}
          scrollable={false}
          surface={1}
        />
      </AccessShield>
      <CoinPreDetailModal
        categories={selectedRow?.symbol.categories}
        coin={selectedRow?.symbol}
        hasShare={true}
        labels={selectedRow?.symbol_labels}
        marketData={selectedRow?.symbol_market_data}
        networks={selectedRow?.networks}
        onClose={() => closeModal()}
        open={isModalOpen}
        security={selectedRow?.symbol_security?.data}
      >
        {selectedRow?.signals_analysis?.sparkline && (
          <CoinPriceChart
            socialIndexes={selectedRow?.signals_analysis?.sparkline.indexes}
            value={selectedRow?.signals_analysis?.sparkline?.prices ?? []}
          />
        )}
        {selectedRow && (
          <SocialRadarSentiment
            className="w-full"
            mode="expanded"
            value={selectedRow}
          />
        )}
        {selectedRow && (
          <SocialRadarSharingModal coin={selectedRow} open={false} />
        )}
      </CoinPreDetailModal>
    </div>
  );
};
