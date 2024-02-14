import dayjs from 'dayjs';
import { Table } from 'antd';
import { useMemo } from 'react';
import { type ColumnType } from 'antd/es/table';
import { useTranslation } from 'react-i18next';
import { type PairSignalerItem } from 'api/signaler';
import PriceChange from 'shared/PriceChange';
import FancyPrice from 'shared/FancyPrice';

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

const SimulatedPositions: React.FC<{ items: PairSignalerItem[] }> = ({
  items,
}) => {
  const { t } = useTranslation('strategy');
  const columns = useMemo<Array<ColumnType<PairSignalerItem>>>(
    () => [
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
            textClassName="!text-base"
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
    [t],
  );

  return <Table columns={columns} dataSource={items ?? []} />;
};

export default SimulatedPositions;
