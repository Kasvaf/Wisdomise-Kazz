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
import CoinPreDetailModal from 'modules/insight/PageHome/components/HomeMobile/CoinPreDetailModal';
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

  const [detailSlug, setDetailSlug] = useState('');

  const coins = useSocialRadarCoins(tableState);

  const columns = useMemo<Array<MobileTableColumn<SocialRadarCoin>>>(
    () => [
      {
        key: 'rank',
        width: '1rem',
        className: 'text-xs font-medium text-start',
        render: row => row.rank,
      },
      {
        key: 'coin',
        width: '125px',
        className: 'text-sm',
        render: row => (
          <Coin
            coin={row.symbol}
            imageClassName="size-7"
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
        className: 'flex items-center justify-center gap-4',
        grow: true,
        render: row => <SocialSentiment value={row} detailsLevel={2} />,
      },
      {
        key: 'labels',
        className: 'flex flex-col items-end justify-center gap-2',
        width: '85px',
        render: row => (
          <>
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
          </>
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
          'trial': 3,
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
          onClick={r => r.symbol.slug && setDetailSlug(r.symbol.slug)}
        />
      </AccessShield>
      <CoinPreDetailModal slug={detailSlug} onClose={() => setDetailSlug('')} />
    </>
  );
};
