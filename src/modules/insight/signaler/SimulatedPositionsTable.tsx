import dayjs from 'dayjs';
import { Table } from 'antd';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { type TableProps, type ColumnType } from 'antd/es/table';
import { type ThinStrategy, useSignalerPairs } from 'api';
import PriceChange from 'shared/PriceChange';
import FancyPrice from 'shared/FancyPrice';
import PairInfo from 'shared/PairInfo';

interface Position {
  pair_name: string;
  strategy?: ThinStrategy;

  position_side: 'LONG' | 'SHORT';
  entry_time: string;
  entry_price: number;
  exit_time?: string;
  exit_price?: number;
  pnl: number;
}

const PriceTime: React.FC<{ price?: number | null; time?: string | null }> = ({
  price,
  time,
}) => {
  if (!price || !time) return null;

  return (
    <div>
      <FancyPrice className="text-sm" value={price} />
      <div className="text-xs text-white/30">
        {dayjs(time).format('HH:mm MMM DD')}
      </div>
    </div>
  );
};

const SimulatedPositionsTable: React.FC<{
  items: Position[];
  withCoins?: boolean;
  withStrategy?: boolean;
  pagination?: TableProps<ColumnType<Position>>['pagination'];
}> = ({ items, withCoins, withStrategy, pagination }) => {
  const { t } = useTranslation('strategy');
  const { data: pairs } = useSignalerPairs();
  const columns = useMemo<Array<ColumnType<Position>>>(
    () => [
      ...(withCoins
        ? ([
            {
              title: t('positions-history.pairs'),
              dataIndex: 'pair_name',
              render: (_, { pair_name: pn }) => {
                const pair = pairs?.find(p => p.name === pn);
                if (!pair) return null;
                return (
                  <PairInfo
                    base={pair.base.name}
                    quote={pair.quote.name}
                    title={pair.display_name}
                    className="!justify-start"
                  />
                );
              },
            },
          ] satisfies Array<ColumnType<Position>>)
        : []),
      ...(withStrategy
        ? ([
            {
              title: t('positions-history.strategy'),
              dataIndex: 'strategy',
              render: (_, { strategy }) =>
                strategy?.profile?.title || strategy?.name,
            },
          ] satisfies Array<ColumnType<Position>>)
        : []),
      {
        title: t('positions-history.type'),
        dataIndex: 'position_side',
        render: (_, { position_side: ps }) => (
          <p className="capitalize">{ps}</p>
        ),
      },
      {
        title: t('positions-history.pnl'),
        dataIndex: 'pnl',
        render: (_, { pnl }) => (
          <PriceChange
            value={pnl}
            textClassName="!desktop:text-base !mobile:text-sm"
            className="!justify-start"
          />
        ),
      },
      {
        title: t('positions-history.entry-point'),
        dataIndex: 'entry_price',
        render: (_, { entry_price: ep, entry_time: et }) => (
          <PriceTime price={ep} time={et} />
        ),
      },
      {
        title: t('positions-history.exit-point'),
        dataIndex: 'exit_price',
        render: (_, { exit_price: ep, exit_time: et }) => (
          <PriceTime price={ep} time={et} />
        ),
      },
    ],
    [withCoins, t, withStrategy, pairs],
  );

  return (
    <Table columns={columns} dataSource={items ?? []} pagination={pagination} />
  );
};

export default SimulatedPositionsTable;
