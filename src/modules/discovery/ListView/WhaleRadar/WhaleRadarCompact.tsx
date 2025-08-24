import { useWhaleRadarCoins, type WhaleRadarCoin } from 'api/discovery';
import { useDiscoveryParams } from 'modules/discovery/lib';
import { type FC, useMemo } from 'react';
import { AccessShield } from 'shared/AccessShield';
import { CoinMarketCap } from 'shared/CoinMarketCap';
import { CoinPriceChart } from 'shared/CoinPriceChart';
import { DirectionalNumber } from 'shared/DirectionalNumber';
import { useLoadingBadge } from 'shared/LoadingBadge';
import { useGlobalNetwork } from 'shared/useGlobalNetwork';
import { usePageState } from 'shared/usePageState';
import { Coin } from 'shared/v1-components/Coin';
import { Table, type TableColumn } from 'shared/v1-components/Table';
import {
  CoinPreDetailModal,
  useCoinPreDetailModal,
} from '../CoinPreDetailModal';
import { WhaleRadarFilters } from './WhaleRadarFilters';
import { WhaleRadarSentiment } from './WhaleRadarSentiment';

export const WhaleRadarCompact: FC<{ focus?: boolean }> = ({ focus }) => {
  const [pageState, setPageState] = usePageState<
    Parameters<typeof useWhaleRadarCoins>[0]
  >('whale-radar-coins', {
    sortBy: 'rank',
    sortOrder: 'ascending',
  });
  const [globalNetwork] = useGlobalNetwork();

  const coins = useWhaleRadarCoins(pageState);
  useLoadingBadge(coins.isFetching);

  const [openModal, { closeModal, isModalOpen, selectedRow }] =
    useCoinPreDetailModal<WhaleRadarCoin>({
      directNavigate: !focus,
      slug: r => {
        const contractAddress = r.networks.find(
          x => x.network.slug === globalNetwork,
        )?.contract_address;
        return {
          slug: r.symbol.slug,
          network: globalNetwork,
          contractAddress,
        };
      },
    });

  const columns = useMemo<Array<TableColumn<WhaleRadarCoin>>>(
    () => [
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
          onClick={r => openModal(r)}
          rowKey={r => JSON.stringify(r.symbol)}
          scrollable={false}
          surface={2}
        />
      </AccessShield>
      <CoinPreDetailModal
        categories={selectedRow?.symbol.categories}
        coin={selectedRow?.symbol}
        labels={selectedRow?.symbol_labels}
        marketData={selectedRow?.data}
        networks={selectedRow?.networks}
        onClose={() => closeModal()}
        open={isModalOpen}
        security={selectedRow?.symbol_security?.data}
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
          <WhaleRadarSentiment mode="expanded" value={selectedRow} />
        )}
      </CoinPreDetailModal>
    </div>
  );
};
