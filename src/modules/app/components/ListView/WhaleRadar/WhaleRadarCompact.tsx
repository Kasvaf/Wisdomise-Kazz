/* eslint-disable import/max-dependencies */
import { type FC, useMemo } from 'react';
import { Coin } from 'shared/Coin';
import { AccessShield } from 'shared/AccessShield';
import { CoinLabels } from 'shared/CoinLabels';
import { useWhaleRadarCoins, type WhaleRadarCoin } from 'api';
import { CoinMarketCap } from 'shared/CoinMarketCap';
import { Table, type TableColumn } from 'shared/v1-components/Table';
import { DirectionalNumber } from 'shared/DirectionalNumber';
import { CoinPriceChart } from 'shared/CoinPriceChart';
import { useLoadingBadge } from 'shared/LoadingBadge';
import { RadarFilter } from 'modules/app/components/ListView/RadarFilter';
import { usePageState } from 'shared/usePageState';
import { TableRank } from 'shared/TableRank';
import {
  CoinPreDetailModal,
  useCoinPreDetailModal,
} from '../CoinPreDetailModal';
import { WhaleRadarSentiment } from './WhaleRadarSentiment';

export const WhaleRadarCompact: FC<{ focus?: boolean }> = ({ focus }) => {
  const [tableState, setTableState] = usePageState<
    Required<Parameters<typeof useWhaleRadarCoins>[0]>
  >('whale-radar-coins', {
    sortBy: 'rank',
    sortOrder: 'ascending',
    query: '',
    categories: [] as string[],
    networks: [] as string[],
    trendLabels: [] as string[],
    securityLabels: [] as string[],
    days: 7,
    excludeNativeCoins: false,
    profitableOnly: false,
  });

  const coins = useWhaleRadarCoins(tableState);
  useLoadingBadge(coins.isFetching);

  const [openModal, { closeModal, isModalOpen, selectedRow }] =
    useCoinPreDetailModal<WhaleRadarCoin>({
      directNavigate: !focus,
      slug: r => r.symbol.slug,
    });

  const columns = useMemo<Array<TableColumn<WhaleRadarCoin>>>(
    () => [
      {
        key: 'rank',
        render: row => <TableRank>{row.rank}</TableRank>,
      },
      {
        key: 'coin',
        render: row => (
          <Coin
            coin={row.symbol}
            imageClassName="size-7"
            className="text-sm"
            truncate={90}
            nonLink={true}
            abbrevationSuffix={
              <DirectionalNumber
                className="ms-1"
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
            }
          />
        ),
      },
      {
        key: 'sentiment',
        render: row => <WhaleRadarSentiment value={row} mode="mini" />,
      },
      {
        key: 'labels',
        align: 'end',
        render: row => (
          <div className="flex flex-col items-end justify-center gap-2">
            <CoinLabels
              categories={row.symbol.categories}
              labels={row.symbol_labels}
              networks={row.networks}
              security={row.symbol_security?.data}
              coin={row.symbol}
              size="xs"
              truncate
              clickable={false}
            />
            <CoinMarketCap
              marketData={row.data}
              singleLine
              className="text-xxs"
            />
          </div>
        ),
      },
    ],
    [],
  );

  return (
    <>
      <RadarFilter
        radar="whale-radar"
        value={tableState}
        onChange={newState => setTableState(newState)}
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
    </>
  );
};
