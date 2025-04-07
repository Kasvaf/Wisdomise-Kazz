/* eslint-disable import/max-dependencies */
import { type FC, useMemo } from 'react';
import { useTableState } from 'shared/Table';
import { Coin } from 'shared/Coin';
import { AccessShield } from 'shared/AccessShield';
import { CoinLabels } from 'shared/CoinLabels';
import { type TechnicalRadarCoin, useTechnicalRadarCoins } from 'api';
import { CoinMarketCap } from 'shared/CoinMarketCap';
import { MobileTable, type MobileTableColumn } from 'shared/MobileTable';
import { DirectionalNumber } from 'shared/DirectionalNumber';
import { useLoadingBadge } from 'shared/LoadingBadge';
import { TechnicalRadarSentiment } from '../TechnicalRadarSentiment';
import { TechnicalRadarFilters } from '../TechnicalRadarFilters';

export const TechnicalRadarCoinsTable: FC<{
  onClick?: (coin: TechnicalRadarCoin) => void;
}> = ({ onClick }) => {
  const [, tableState, setTableState] = useTableState<
    Required<Parameters<typeof useTechnicalRadarCoins>[0]>
  >('overviewTable', {
    page: 1,
    pageSize: 10,
    sortBy: 'rank',
    sortOrder: 'ascending',
    query: '',
    categories: [] as string[],
    networks: [] as string[],
  });

  const coins = useTechnicalRadarCoins(tableState);
  useLoadingBadge(coins.isFetching);

  const columns = useMemo<Array<MobileTableColumn<TechnicalRadarCoin>>>(
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
            truncate={85}
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
        render: row => <TechnicalRadarSentiment value={row} mode="mini" />,
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
      <TechnicalRadarFilters
        value={tableState}
        onChange={newState => setTableState(newState)}
        className="mb-2 w-full"
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
          onClick={r => onClick?.(r)}
        />
      </AccessShield>
    </>
  );
};
