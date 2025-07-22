/* eslint-disable import/max-dependencies */
import { type FC, useMemo } from 'react';
import { Coin } from 'shared/v1-components/Coin';
import { AccessShield } from 'shared/AccessShield';
import { type SocialRadarCoin, useSocialRadarCoins } from 'api/discovery';
import { CoinMarketCap } from 'shared/CoinMarketCap';
import { Table, type TableColumn } from 'shared/v1-components/Table';
import { DirectionalNumber } from 'shared/DirectionalNumber';
import { CoinPriceChart } from 'shared/CoinPriceChart';
import { useLoadingBadge } from 'shared/LoadingBadge';
import { TableRank } from 'shared/TableRank';
import { usePageState } from 'shared/usePageState';
import { useDiscoveryRouteMeta } from 'modules/discovery/useDiscoveryRouteMeta';
import {
  CoinPreDetailModal,
  useCoinPreDetailModal,
} from '../CoinPreDetailModal';
import { SocialRadarSentiment } from './SocialRadarSentiment';
import SocialRadarSharingModal from './SocialRadarSharingModal';
import { SocialRadarFilters } from './SocialRadarFilters';

export const SocialRadarCompact: FC<{ focus?: boolean }> = ({ focus }) => {
  const [pageState, setPageState] = usePageState<
    Parameters<typeof useSocialRadarCoins>[0]
  >('social-radar', {
    sortBy: 'rank',
    sortOrder: 'ascending',
  });

  const [openModal, { closeModal, isModalOpen, selectedRow }] =
    useCoinPreDetailModal<SocialRadarCoin>({
      directNavigate: !focus,
      slug: r => r.symbol.slug,
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
            slug={row.symbol.slug}
            logo={row.symbol.logo_url}
            categories={row.symbol.categories}
            labels={row.symbol_labels}
            networks={row.networks}
            security={row.symbol_security?.data}
            extra={
              <>
                <DirectionalNumber
                  value={row.symbol_market_data?.price_change_percentage_24h}
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
                  marketData={row.symbol_market_data}
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
        align: 'end',
        render: row => <SocialRadarSentiment value={row} mode="tiny" />,
      },
    ],
    [],
  );

  const {
    params: { slug: activeSlug },
  } = useDiscoveryRouteMeta();

  return (
    <div className="p-3">
      <SocialRadarFilters
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
          onClick={r => openModal(r)}
          scrollable={false}
          isActive={r => r.symbol.slug === activeSlug}
        />
      </AccessShield>
      <CoinPreDetailModal
        coin={selectedRow?.symbol}
        categories={selectedRow?.symbol.categories}
        labels={selectedRow?.symbol_labels}
        marketData={selectedRow?.symbol_market_data}
        networks={selectedRow?.networks}
        security={selectedRow?.symbol_security?.data}
        open={isModalOpen}
        onClose={() => closeModal()}
        hasShare={true}
      >
        {selectedRow?.signals_analysis?.sparkline && (
          <CoinPriceChart
            value={selectedRow?.signals_analysis?.sparkline?.prices ?? []}
            socialIndexes={selectedRow?.signals_analysis?.sparkline.indexes}
          />
        )}
        {selectedRow && (
          <SocialRadarSentiment
            value={selectedRow}
            mode="expanded"
            className="w-full"
          />
        )}
        {selectedRow && (
          <SocialRadarSharingModal open={false} coin={selectedRow} />
        )}
      </CoinPreDetailModal>
    </div>
  );
};
