/* eslint-disable import/max-dependencies */
import { type FC, useMemo } from 'react';
import { Coin } from 'shared/v1-components/Coin';
import { AccessShield } from 'shared/AccessShield';
import { useWhaleRadarCoins, type WhaleRadarCoin } from 'api/discovery';
import { CoinMarketCap } from 'shared/CoinMarketCap';
import { Table, type TableColumn } from 'shared/v1-components/Table';
import { DirectionalNumber } from 'shared/DirectionalNumber';
import { CoinPriceChart } from 'shared/CoinPriceChart';
import { useLoadingBadge } from 'shared/LoadingBadge';
import { usePageState } from 'shared/usePageState';
import { useDiscoveryRouteMeta } from 'modules/discovery/useDiscoveryRouteMeta';
import {
  CoinPreDetailModal,
  useCoinPreDetailModal,
} from '../CoinPreDetailModal';
import { WhaleRadarSentiment } from './WhaleRadarSentiment';
import { WhaleRadarFilters } from './WhaleRadarFilters';

export const WhaleRadarCompact: FC<{ focus?: boolean }> = ({ focus }) => {
  const [pageState, setPageState] = usePageState<
    Parameters<typeof useWhaleRadarCoins>[0]
  >('whale-radar-coins', {
    sortBy: 'rank',
    sortOrder: 'ascending',
  });

  const coins = useWhaleRadarCoins(pageState);
  useLoadingBadge(coins.isFetching);

  const [openModal, { closeModal, isModalOpen, selectedRow }] =
    useCoinPreDetailModal<WhaleRadarCoin>({
      directNavigate: !focus,
      slug: r => r.symbol.slug,
    });

  const columns = useMemo<Array<TableColumn<WhaleRadarCoin>>>(
    () => [
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
        align: 'end',
        render: row => <WhaleRadarSentiment value={row} mode="tiny" />,
      },
    ],
    [],
  );

  const {
    params: { slug: activeSlug },
  } = useDiscoveryRouteMeta();

  return (
    <div className="p-3">
      <WhaleRadarFilters
        value={pageState}
        onChange={newPageState => setPageState(newPageState)}
        className="mb-4 w-full"
        surface={1}
        mini
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
          rowKey={r => JSON.stringify(r.symbol)}
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
        marketData={selectedRow?.data}
        networks={selectedRow?.networks}
        security={selectedRow?.symbol_security?.data}
        open={isModalOpen}
        onClose={() => closeModal()}
      >
        {selectedRow && (
          <CoinPriceChart
            value={(selectedRow.chart_data ?? []).map(p => ({
              related_at: p.related_at,
              value: p.price,
            }))}
            whalesActivity={selectedRow.chart_data}
          />
        )}
        {selectedRow && (
          <WhaleRadarSentiment value={selectedRow} mode="expanded" />
        )}
      </CoinPreDetailModal>
    </div>
  );
};
