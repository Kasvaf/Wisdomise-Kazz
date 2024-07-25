import dayjs from 'dayjs';
import { Table } from 'antd';
import { useMemo } from 'react';
import * as numerable from 'numerable';
import { type ColumnType } from 'antd/es/table';
import { useTranslation } from 'react-i18next';
import { bxRightArrowAlt } from 'boxicons-quasar';
import { useMainQuote } from 'api';
import { type StrategyPosition } from 'api/builder';
import usePositionDetailModal from 'modules/insight/usePositionDetailModal';
import PriceChange from 'shared/PriceChange';
import PairInfo from 'shared/PairInfo';
import Button from 'shared/Button';
import Icon from 'shared/Icon';

interface Props {
  positions: StrategyPosition[];
}

function diff(
  side: 'LONG' | 'SHORT',
  actual?: number | null,
  signal?: number | null,
) {
  const p = (100 * (Number(actual) - Number(signal))) / Number(signal);
  return p && (side === 'SHORT' ? p : -p);
}

const formatPrice = (price: number) =>
  numerable.format(price, price > -1 && price < 1 ? '0.0000' : '0,0.00');

const PositionInfo: React.FC<{
  position: StrategyPosition;
  type?: 'entry' | 'exit';
  diff?: number;
}> = ({ position, type, diff }) => {
  const { t } = useTranslation('builder');

  const priceField =
    type === 'entry' ? ('entry_price' as const) : ('exit_price' as const);
  const timeField =
    type === 'entry' ? ('entry_time' as const) : ('exit_time' as const);

  const { [priceField]: actualPrice, [timeField]: actualTime } =
    position.actual_position || {};
  const { [priceField]: signalPrice, [timeField]: signalTime } =
    position.strategy_position || {};

  return (
    <div>
      {actualPrice != null && (
        <div className="flex items-center justify-between rounded-lg bg-black/20 p-3 text-white/80">
          <div>{t('actual-pos-table.actual')}</div>
          <div className="text-right">
            <div>${formatPrice(actualPrice)}</div>
            <div className="mt-2 text-white/20">
              {dayjs(actualTime).format('HH:mm, MMM DD')}
            </div>
          </div>
        </div>
      )}

      {signalPrice != null && (
        <div className="flex items-center justify-between px-3 py-1 text-xxs text-white/20">
          <div>{t('actual-pos-table.signal')}</div>
          <div className="text-right">
            {diff && (
              <div
                className={diff < 0 ? 'text-[#F14056]/50' : 'text-[#40F19C]/50'}
              >
                {Math.abs(diff).toFixed(2)}%
              </div>
            )}
            <div>${formatPrice(signalPrice)}</div>
            <div>{dayjs(signalTime).format('HH:mm, MMM DD')}</div>
          </div>
        </div>
      )}
    </div>
  );
};

const PnlInfo: React.FC<{
  position: StrategyPosition;
}> = ({ position: p }) => {
  const { t } = useTranslation('builder');
  const { manager } = p.strategy_position || {};
  const isMulti =
    Number(manager?.take_profit?.length) > 1 ||
    Number(manager?.stop_loss?.length) > 1;

  const [PositionDetailModal, showPositionDetailModal] = usePositionDetailModal(
    p.strategy_position,
  );

  return (
    <div className="grid grid-cols-[max-content_1fr] gap-3">
      <div>{t('actual-pos-table.actual')}:</div>
      <PriceChange
        value={p.actual_position.pnl}
        className="!justify-start"
        valueToFixed
      />

      {p.strategy_position && (
        <>
          <div className="opacity-30">{t('actual-pos-table.signal')}:</div>
          <PriceChange
            value={p.strategy_position.pnl}
            className="!justify-start opacity-30"
            valueToFixed
          />
        </>
      )}

      {isMulti && (
        <div className="col-span-2 ml-2 mt-1">
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

const ActualPositionsTable: React.FC<Props> = ({ positions }) => {
  const { t } = useTranslation('builder');
  const quote = useMainQuote() || 'USDT';

  const columns = useMemo<Array<ColumnType<StrategyPosition>>>(
    () => [
      {
        title: t('actual-pos-table.asset'),
        render: (_, p) => (
          <PairInfo
            base={p.actual_position.pair.base.name}
            quote={p.actual_position.pair.quote.name}
            title={p.actual_position.pair.display_name}
            className="!justify-start"
          />
        ),
      },
      {
        title: t('actual-pos-table.type'),
        dataIndex: '',
        render: (_, p) => (
          <div className="capitalize">
            {p.actual_position.position_side.toLocaleLowerCase()}
          </div>
        ),
      },
      {
        title: t('actual-pos-table.size'),
        render: (_, p) => (
          <div>
            {formatPrice(p.actual_position.amount)}
            <span className="ml-2 text-white/60">{quote}</span>
          </div>
        ),
      },
      {
        title: t('actual-pos-table.p-l'),
        render: (_, p) => <PnlInfo position={p} />,
      },
      {
        title: t('actual-pos-table.entry-point'),
        render: (_, p) => (
          <PositionInfo
            position={p}
            type="entry"
            diff={diff(
              p.actual_position.position_side,
              p.actual_position.entry_price,
              p.strategy_position?.entry_price,
            )}
          />
        ),
      },
      {
        title: t('actual-pos-table.exit-point'),
        render: (_, p) => (
          <PositionInfo
            position={p}
            type="exit"
            diff={
              -1 *
              diff(
                p.actual_position.position_side,
                p.actual_position.exit_price,
                p.strategy_position?.exit_price,
              )
            }
          />
        ),
      },
    ],
    [quote, t],
  );

  return <Table columns={columns} dataSource={positions ?? []} />;
};

export default ActualPositionsTable;
