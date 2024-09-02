import { type ColumnType } from 'antd/es/table';
import { type FC, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  type useRsiDivergence,
  type RsiDivergenceRow,
  type RsiDivergenceResponse,
} from 'api/market-pulse';
import Table from 'shared/Table';
import PriceChange from 'shared/PriceChange';
import { ReadableNumber } from 'shared/ReadableNumber';
import { Coin } from 'shared/Coin';

export const RsiDivergenceTable: FC<{
  type: keyof RsiDivergenceResponse;
  divergence: ReturnType<typeof useRsiDivergence>;
}> = ({ type, divergence }) => {
  const { t } = useTranslation('market-pulse');
  const columns = useMemo<
    Array<
      ColumnType<
        RsiDivergenceRow & {
          rank: number;
        }
      >
    >
  >(
    () => [
      {
        title: '#',
        dataIndex: 'rank',
        sorter: (a, b) => a.rank - b.rank,
      },
      {
        title: t('indicator_list.rsi.table.name'),
        render: (_, row) => (
          <Coin
            coin={{
              abbreviation: row.candle_base_abbreviation,
              name: row.candle_base_name,
              slug: row.candle_base_slug,
              logo_url: row.image,
            }}
          />
        ),
      },
      {
        title: t('indicator_list.rsi.table.price'),
        sorter: (a, b) => a.current_price - b.current_price,
        dataIndex: 'current_price',
        render: value => <ReadableNumber value={value} label="$" />,
      },
      {
        title: (
          <>
            {t('indicator_list.rsi.table.price_change')}
            <span className="ms-1 text-xxs">(24{t('periods.hour')}%)</span>
          </>
        ),
        sorter: (a, b) => a.price_change_percentage - b.price_change_percentage,
        render: (_, row) => (
          <PriceChange
            className="inline-flex"
            value={row.price_change_percentage}
          />
        ),
      },
      {
        title: t('indicator_list.rsi.table.resolution'),
        render: (_, row) => row.candle_resolution,
      },
      {
        title: t('indicator_list.rsi.table.duration'),
        render: (_, row) => row.divergence_length,
      },
    ],
    [t],
  );

  return (
    <div className="w-full overflow-auto">
      <Table
        columns={columns}
        className="min-w-max overflow-auto"
        dataSource={
          divergence.data?.data[type].map((row, index) => ({
            rank: index + 1,
            ...row,
          })) ?? []
        }
        rowKey={row => `${row.candle_base_abbreviation}${row.rank}`}
      />
    </div>
  );
};
