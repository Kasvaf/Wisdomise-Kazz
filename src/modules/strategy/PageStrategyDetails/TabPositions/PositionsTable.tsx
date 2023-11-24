import { Table } from 'antd';
import { useMemo } from 'react';
import * as numerable from 'numerable';
import { type ColumnType } from 'antd/es/table';
import dayjs from 'dayjs';
import { type StrategyPosition } from 'api';
import PriceChange from 'modules/shared/PriceChange';
import useMainQuote from 'modules/shared/useMainQuote';
import PairInfo from 'modules/shared/PairInfo';

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

const PositionInfo: React.FC<{
  actualPrice?: number;
  actualTime?: string;
  signalPrice?: number;
  signalTime?: string;
  diff?: number;
}> = p => {
  return (
    <div>
      {p.actualPrice != null && (
        <div className="flex items-center justify-between rounded-lg bg-black/20 p-3 text-white/80">
          <div>Actual</div>
          <div className="text-right">
            <div>{numerable.format(p.actualPrice, '$$0,0.00')}</div>
            <div className="mt-2 text-white/20">
              {dayjs(p.actualTime).format('HH:mm, MMM DD')}
            </div>
          </div>
        </div>
      )}

      {p.signalPrice != null && (
        <div className="flex items-center justify-between px-3 py-1 text-xxs text-white/20">
          <div>Signal</div>
          <div className="text-right">
            {p.diff && (
              <div
                className={
                  p.diff < 0 ? 'text-[#F14056]/50' : 'text-[#40F19C]/50'
                }
              >
                {Math.abs(p.diff).toFixed(2)}%
              </div>
            )}
            <div>{numerable.format(p.signalPrice, '$$0,0.00')}</div>
            <div>{dayjs(p.signalTime).format('HH:mm, MMM DD')}</div>
          </div>
        </div>
      )}
    </div>
  );
};

const PositionsTable: React.FC<Props> = ({ positions }) => {
  const quote = useMainQuote() || 'USDT';

  const columns = useMemo<Array<ColumnType<StrategyPosition>>>(
    () => [
      {
        title: 'Asset',
        render: (_, p) => (
          <PairInfo
            base={p.actual_position.pair.base.name}
            quote={p.actual_position.pair.quote.name}
            title={p.actual_position.pair.title}
            className="!justify-start"
          />
        ),
      },
      {
        title: 'Type',
        dataIndex: '',
        render: (_, p) => (
          <div className="capitalize">
            {p.actual_position.position_side.toLocaleLowerCase()}
          </div>
        ),
      },
      {
        title: 'Size',
        render: (_, p) => (
          <div>
            {numerable.format(p.actual_position.amount, '0,0.00')}
            <span className="ml-2 text-white/60">{quote}</span>
          </div>
        ),
      },
      {
        title: 'P/L',
        render: (_, p) => (
          <div className="grid grid-cols-2">
            <div>Actual:</div>
            <PriceChange
              value={p.actual_position.pnl}
              className="!justify-start"
            />

            {p.strategy_position && (
              <>
                <div className="opacity-30">Signal:</div>
                <PriceChange
                  value={p.strategy_position.pnl}
                  className="!justify-start opacity-30"
                />
              </>
            )}
          </div>
        ),
      },
      {
        title: 'Entry Point',
        render: (_, p) => (
          <PositionInfo
            actualPrice={p.actual_position.entry_price}
            actualTime={p.actual_position.entry_time}
            signalPrice={p.strategy_position?.entry_price}
            signalTime={p.strategy_position?.entry_time}
            diff={diff(
              p.actual_position.position_side,
              p.actual_position.entry_price,
              p.strategy_position?.entry_price,
            )}
          />
        ),
      },
      {
        title: 'Exit Point',
        render: (_, p) => (
          <PositionInfo
            actualPrice={p.actual_position.exit_price}
            actualTime={p.actual_position.exit_time}
            signalPrice={p.strategy_position?.exit_price}
            signalTime={p.strategy_position?.exit_time}
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
    [quote],
  );

  return <Table columns={columns} dataSource={positions ?? []} />;
};

export default PositionsTable;
