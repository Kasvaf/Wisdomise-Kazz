/* eslint-disable import/max-dependencies */
import { useMemo, useState } from 'react';
import { MobileSearchBar } from 'shared/MobileSearchBar';
import RadarsTabs from 'modules/insight/RadarsTabs';
import { useTableState } from 'shared/Table';
import { Coin } from 'shared/Coin';
import { AccessShield } from 'shared/AccessShield';
import { CoinLabels } from 'shared/CoinLabels';
import { type SocialRadarCoin, useSocialRadarCoins } from 'api';
import { CoinMarketCap } from 'shared/CoinMarketCap';
import { MobileTable, type MobileTableColumn } from 'shared/MobileTable';
import { DirectionalNumber } from 'shared/DirectionalNumber';
import { CoinPreDetailModal } from 'modules/insight/CoinPreDetailModal';
import { CoinPriceChart } from 'shared/CoinPriceChart';
import { SocialSentiment } from '../SocialSentiment';
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

  const columns = useMemo<Array<MobileTableColumn<SocialRadarCoin>>>(
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
        render: row => <SocialSentiment value={row} mode="summary" />,
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
      <MobileSearchBar className="mb-4" />
      <RadarsTabs className="mb-4" />
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
          'free': true,
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
        {selectedRow && <SocialSentiment value={selectedRow} mode="expanded" />}
      </CoinPreDetailModal>
    </>
  );
};
