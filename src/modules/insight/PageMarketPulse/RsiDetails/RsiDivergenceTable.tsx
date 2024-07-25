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
import { Coin } from '../Coin';

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
          <Coin icon={row.image} name={row.candle_base_abbreviation} />
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
      // {
      //   title: t('indicator_list.rsi.table.action'),
      //   render: (_, row) => (
      //     <Link
      //       to={`/insight/coin-radar/${row.candle_base_abbreviation}`}
      //       className="inline-flex items-center gap-1 whitespace-nowrap text-white/60 hover:!text-white"
      //     >
      //       {t('indicator_list.rsi.table.coin_detail')}
      //       <Icon name={bxRightArrowAlt} />
      //     </Link>
      //   ),
      // },
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
