/* eslint-disable import/max-dependencies */
import { useMemo, useState } from 'react';
import { useTableState } from 'shared/Table';
import { Coin } from 'shared/Coin';
import { AccessShield } from 'shared/AccessShield';
import { CoinLabels } from 'shared/CoinLabels';
import { useWhaleRadarCoins, type WhaleRadarCoin } from 'api';
import { CoinMarketCap } from 'shared/CoinMarketCap';
import { MobileTable, type MobileTableColumn } from 'shared/MobileTable';
import { DirectionalNumber } from 'shared/DirectionalNumber';
import { CoinPreDetailModal } from 'modules/insight/CoinPreDetailModal';
import { CoinPriceChart } from 'shared/CoinPriceChart';
import { useLoadingBadge } from 'shared/LoadingBadge';
import { WhaleRadarSentiment } from '../WhaleRadarSentiment';
import { WhaleRadarFilters } from '../WhaleRadarFilters';

export const WhaleRadarMobile = () => {
  const [, tableState, setTableState] = useTableState<
    Required<Parameters<typeof useWhaleRadarCoins>[0]>
  >('', {
    page: 1,
    pageSize: 10,
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

  const [selectedRow, setSelectedRow] = useState<null | WhaleRadarCoin>(null);
  const [modal, setModal] = useState(false);

  const columns = useMemo<Array<MobileTableColumn<WhaleRadarCoin>>>(
    () => [
      {
        key: 'rank',
        className: 'max-w-6 min-w-2 text-start text-xs font-medium',
        render: row => row.rank,
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
        className: 'max-w-24 min-w-16',
        width: '85px',
        render: row => (
          <div className="flex flex-col items-end justify-center gap-2">
            <CoinLabels
              categories={row.symbol.categories}
              labels={row.symbol_labels}
              networks={row.networks}
              security={row.symbol_security?.data}
              coin={row.symbol}
              mini
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
      <WhaleRadarFilters
        value={tableState}
        onChange={newState => setTableState(newState)}
        className="mb-4 w-full"
        surface={1}
      />
      <AccessShield
        mode="mobile_table"
        sizes={{
          'guest': true,
          'initial': 3,
          'free': 3,
          'pro': 3,
          'pro+': 3,
          'pro_max': false,
        }}
      >
        <MobileTable
          columns={columns}
          dataSource={coins.data ?? []}
          rowKey={r => JSON.stringify(r.symbol)}
          loading={coins.isLoading}
          surface={2}
          onClick={r => {
            setSelectedRow(r);
            setModal(true);
          }}
        />
      </AccessShield>
      <CoinPreDetailModal
        coin={selectedRow?.symbol}
        categories={selectedRow?.symbol.categories}
        labels={selectedRow?.symbol_labels}
        marketData={selectedRow?.data}
        networks={selectedRow?.networks}
        security={selectedRow?.symbol_security?.data}
        open={modal}
        onClose={() => setModal(false)}
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
