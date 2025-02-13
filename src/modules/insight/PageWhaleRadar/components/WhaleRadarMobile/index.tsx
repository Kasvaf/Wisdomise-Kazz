/* eslint-disable import/max-dependencies */
import { useMemo, useState } from 'react';
import { MobileSearchBar } from 'shared/MobileSearchBar';
import RadarsTabs from 'modules/insight/RadarsTabs';
import { useTableState } from 'shared/Table';
import { Coin } from 'shared/Coin';
import { AccessShield } from 'shared/AccessShield';
import { CoinLabels } from 'shared/CoinLabels';
import { useWhaleRadarCoins, type WhaleRadarCoin } from 'api';
import { CoinMarketCap } from 'shared/CoinMarketCap';
import { MobileTable, type MobileTableColumn } from 'shared/MobileTable';
import { DirectionalNumber } from 'shared/DirectionalNumber';
import CoinPreDetailModal from 'modules/insight/PageHome/components/HomeMobile/CoinPreDetailModal';
import { WhaleSentiment } from '../WhaleSentiment';
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

  const [detailSlug, setDetailSlug] = useState('');

  const coins = useWhaleRadarCoins(tableState);

  const columns = useMemo<Array<MobileTableColumn<WhaleRadarCoin>>>(
    () => [
      {
        key: 'rank',
        className: 'max-w-6 min-w-2 text-start text-xs font-medium',
        render: row => row.rank,
      },
      {
        key: 'coin',
        className: 'min-w-28 max-w-28 text-sm',
        render: row => (
          <Coin
            coin={row.symbol}
            imageClassName="size-7"
            truncate={60}
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
        render: row => <WhaleSentiment value={row} detailsLevel={1} />,
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
      <MobileSearchBar className="mb-4" />
      <RadarsTabs className="mb-4" />
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
          'free': true,
          'trial': 3,
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
          onClick={r => r.symbol.slug && setDetailSlug(r.symbol.slug)}
        />
      </AccessShield>
      <CoinPreDetailModal slug={detailSlug} onClose={() => setDetailSlug('')} />
    </>
  );
};
