/* eslint-disable import/max-dependencies */
import { useMemo, useState } from 'react';
import { useTableState } from 'shared/Table';
import { Coin } from 'shared/Coin';
import { AccessShield } from 'shared/AccessShield';
import { CoinLabels } from 'shared/CoinLabels';
import {
  MINIMUM_SOCIAL_RADAR_HIGHLIGHTED_SCORE,
  type SocialRadarCoin,
  useSocialRadarCoins,
} from 'api';
import { CoinMarketCap } from 'shared/CoinMarketCap';
import { MobileTable, type MobileTableColumn } from 'shared/MobileTable';
import { DirectionalNumber } from 'shared/DirectionalNumber';
import { CoinPreDetailModal } from 'modules/insight/CoinPreDetailModal';
import { CoinPriceChart } from 'shared/CoinPriceChart';
import { useLoadingBadge } from 'shared/LoadingBadge';
import { TableRank } from 'shared/TableRank';
import { SocialRadarSentiment } from '../SocialRadarSentiment';
import { SocialRadarFilters } from '../SocialRadarFilters';

export const SocialRadarMobile = () => {
  const [, tableState, setTableState] = useTableState<
    Required<Parameters<typeof useSocialRadarCoins>[0]>
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
    exchanges: [] as string[],
    sources: [] as string[],
    windowHours: 24,
  });

  const [selectedRow, setSelectedRow] = useState<null | SocialRadarCoin>(null);
  const [modal, setModal] = useState(false);

  const coins = useSocialRadarCoins(tableState);

  useLoadingBadge(coins.isFetching);

  const columns = useMemo<Array<MobileTableColumn<SocialRadarCoin>>>(
    () => [
      {
        key: 'rank',
        className: 'max-w-6 min-w-2 text-start text-xs font-medium',
        render: row => (
          <TableRank
            highlighted={
              (row.wise_score ?? 0) >= MINIMUM_SOCIAL_RADAR_HIGHLIGHTED_SCORE
            }
          >
            {row.rank}
          </TableRank>
        ),
      },
      {
        key: 'coin',
        render: row => (
          <Coin
            coin={row.symbol}
            imageClassName="size-7"
            className="text-sm"
            truncate={70}
            nonLink={true}
            abbrevationSuffix={
              <DirectionalNumber
                className="ms-1"
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
            }
          />
        ),
      },
      {
        key: 'sentiment',
        render: row => <SocialRadarSentiment value={row} mode="mini" />,
      },
      {
        key: 'labels',
        className: 'max-w-24 min-w-16',
        render: row => (
          <div className="flex flex-col items-end justify-center gap-2">
            <CoinLabels
              categories={row.symbol.categories}
              labels={row.symbol_labels}
              networks={row.networks}
              security={row.symbol_security?.data}
              coin={row.symbol}
              mini
            />
            <CoinMarketCap
              marketData={row.symbol_market_data}
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
      <SocialRadarFilters
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
          'pro': false,
          'pro+': false,
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
        marketData={selectedRow?.symbol_market_data}
        networks={selectedRow?.networks}
        security={selectedRow?.symbol_security?.data}
        open={modal}
        onClose={() => setModal(false)}
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
      </CoinPreDetailModal>
    </>
  );
};
