import { type ColumnType } from 'antd/es/table';
import { type FC, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  type RsiOvernessResponse,
  type RsiOvernessRow,
  type useRsiOverness,
} from 'api/market-pulse';
import Table from 'shared/Table';
import PriceChange from 'shared/PriceChange';
import { ReadableNumber } from 'shared/ReadableNumber';
import { Coin } from 'shared/Coin';
import { RsiNumber } from './RsiNumber';

export const RsiOvernessTable: FC<{
  type: keyof RsiOvernessResponse;
  overness: ReturnType<typeof useRsiOverness>;
}> = ({ type, overness }) => {
  const { t } = useTranslation('market-pulse');
  const columns = useMemo<
    Array<
      ColumnType<
        RsiOvernessRow & {
          rank: number;
        }
      >
    >
  >(
    () => [
      {
        className: '!w-4',
        title: '#',
        dataIndex: 'rank',
        sorter: (a, b) => a.rank - b.rank,
      },
      {
        className: '!w-18',
        title: t('indicator_list.rsi.table.name'),
        render: (_, row) => (
          <Coin image={row.image} abbrevation={row.candle_base_abbreviation} />
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
        title: (
          <>
            {t('indicator_list.rsi.table.rsi')}
            <span className="ms-1 text-xxs">(15{t('periods.min')})</span>
          </>
        ),
        sorter: (a, b) => (a.rsi_value_15m || 0) - (b.rsi_value_15m || 0),
        dataIndex: 'rsi_value_15m',
        render: value => <RsiNumber value={value} />,
      },
      {
        title: (
          <>
            {t('indicator_list.rsi.table.rsi')}
            <span className="ms-1 text-xxs">(30{t('periods.min')})</span>
          </>
        ),
        sorter: (a, b) => (a.rsi_value_30m || 0) - (b.rsi_value_30m || 0),
        dataIndex: 'rsi_value_30m',
        render: value => <RsiNumber value={value} />,
      },
      {
        title: (
          <>
            {t('indicator_list.rsi.table.rsi')}
            <span className="ms-1 text-xxs">(1{t('periods.hour')})</span>
          </>
        ),
        sorter: (a, b) => (a.rsi_value_1h || 0) - (b.rsi_value_1h || 0),
        dataIndex: 'rsi_value_1h',
        render: value => <RsiNumber value={value} />,
      },
      {
        title: (
          <>
            {t('indicator_list.rsi.table.rsi')}
            <span className="ms-1 text-xxs">(4{t('periods.hour')})</span>
          </>
        ),
        sorter: (a, b) => (a.rsi_value_4h || 0) - (b.rsi_value_4h || 0),
        dataIndex: 'rsi_value_4h',
        render: value => <RsiNumber value={value} />,
      },
      {
        title: (
          <>
            {t('indicator_list.rsi.table.rsi')}
            <span className="ms-1 text-xxs">(24{t('periods.hour')})</span>
          </>
        ),
        sorter: (a, b) => (a.rsi_value_1d || 0) - (b.rsi_value_1d || 0),
        dataIndex: 'rsi_value_1d',
        render: value => <RsiNumber value={value} />,
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
          overness.data?.data[type].map((row, index) => ({
            rank: index + 1,
            ...row,
          })) ?? []
        }
        rowKey={row => `${row.candle_base_abbreviation}${row.rank}`}
      />
    </div>
  );
};
