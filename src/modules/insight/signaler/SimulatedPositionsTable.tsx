/* eslint-disable import/max-dependencies */
import dayjs from 'dayjs';
import { Table } from 'antd';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { type TableProps, type ColumnType } from 'antd/es/table';
import { bxRightArrowAlt } from 'boxicons-quasar';
import { type ThinStrategy, useSignalerPairs } from 'api';
import PriceChange from 'shared/PriceChange';
import FancyPrice from 'shared/FancyPrice';
import PairInfo from 'shared/PairInfo';
import Badge from 'shared/Badge';
import Button from 'shared/Button';
import Icon from 'shared/Icon';
import { type FullPosition } from 'api/builder';
import usePositionDetailModal from '../usePositionDetailModal';
import usePositionStatusMap from './usePositionStatusMap';

interface Position extends FullPosition {
  strategy?: ThinStrategy;
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

const StatusInfo: React.FC<{
  position: Position;
}> = ({ position: p }) => {
  const statusMap = usePositionStatusMap();

  const { manager } = p || {};
  const isMulti =
    Number(manager?.take_profit?.length) > 1 ||
    Number(manager?.stop_loss?.length) > 1;
  const [PositionDetailModal, showPositionDetailModal] =
    usePositionDetailModal(p);

  return (
    <div className="flex flex-col items-start gap-1">
      <div className="flex justify-start">
        <Badge
          color={statusMap[p.status].color}
          label={statusMap[p.status].label}
        />
      </div>

      {isMulti && (
        <div className="col-span-2">
          {PositionDetailModal}
          <Button
            variant="alternative"
            className="mx-auto !px-2 !py-0 text-xxs"
            onClick={showPositionDetailModal}
          >
            Multi TP/SL
            <Icon name={bxRightArrowAlt} size={16} />
          </Button>
        </div>
      )}
    </div>
  );
};

const SimulatedPositionsTable: React.FC<{
  items: Position[];
  withCoins?: boolean;
  withStrategy?: boolean;
  withNumbering?: boolean;
  pagination?: TableProps<ColumnType<Position>>['pagination'];
}> = ({ items, withCoins, withStrategy, withNumbering, pagination }) => {
  const { t } = useTranslation('strategy');
  const { data: pairs } = useSignalerPairs();
  const hasStatus = items.length === 0 || !!items[0]?.status;

  const columns = useMemo<Array<ColumnType<Position>>>(
    () => [
      ...(withNumbering
        ? ([
            {
              title: '#',
              dataIndex: 'pair_name',
              render: (_, _2, index) => String(index + 1),
            },
          ] satisfies Array<ColumnType<Position>>)
        : []),
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
      ...(hasStatus
        ? ([
            {
              title: t('positions-history.status'),
              dataIndex: 'status',
              render: (_, p) => <StatusInfo position={p} />,
            },
          ] satisfies Array<ColumnType<Position>>)
        : []),
    ],
    [withNumbering, withCoins, t, withStrategy, hasStatus, pairs],
  );

  return (
    <Table columns={columns} dataSource={items ?? []} pagination={pagination} />
  );
};

export default SimulatedPositionsTable;
