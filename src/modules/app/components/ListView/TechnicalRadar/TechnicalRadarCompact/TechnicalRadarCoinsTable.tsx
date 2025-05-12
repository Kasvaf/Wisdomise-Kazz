/* eslint-disable import/max-dependencies */
import { type FC, useMemo } from 'react';
import { Coin } from 'shared/Coin';
import { AccessShield } from 'shared/AccessShield';
import { CoinLabels } from 'shared/CoinLabels';
import { type TechnicalRadarCoin, useTechnicalRadarCoins } from 'api';
import { CoinMarketCap } from 'shared/CoinMarketCap';
import { Table, type TableColumn } from 'shared/v1-components/Table';
import { DirectionalNumber } from 'shared/DirectionalNumber';
import { useLoadingBadge } from 'shared/LoadingBadge';
import { TableRank } from 'shared/TableRank';
import { RadarFilter } from 'modules/insight/RadarFilter';
import { usePageState } from 'shared/usePageState';
import { TechnicalRadarSentiment } from '../TechnicalRadarSentiment';

export const TechnicalRadarCoinsTable: FC<{
  onClick?: (coin: TechnicalRadarCoin) => void;
}> = ({ onClick }) => {
  const [tableState, setTableState] = usePageState<
    Required<Parameters<typeof useTechnicalRadarCoins>[0]>
  >('technical-radar', {
    sortBy: 'rank',
    sortOrder: 'ascending',
    query: '',
    categories: [] as string[],
    networks: [] as string[],
  });

  const coins = useTechnicalRadarCoins(tableState);
  useLoadingBadge(coins.isFetching);

  const columns = useMemo<Array<TableColumn<TechnicalRadarCoin>>>(
    () => [
      {
        key: 'rank',
        className: 'max-w-6 min-w-2 text-start text-xs font-medium',
        render: row => (
          <TableRank highlighted={row._highlighted}>{row.rank}</TableRank>
        ),
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
        radar="technical-radar"
        value={tableState}
        onChange={newState => setTableState(newState)}
        className="mb-2 w-full"
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
          onClick={r => onClick?.(r)}
        />
      </AccessShield>
    </>
  );
};
