import dayjs from 'dayjs';
import { clsx } from 'clsx';
import * as numerable from 'numerable';
import React, { useState } from 'react';
import { useFpiPositionHistory } from 'api/fpi';
import Pager from 'shared/Pager';
import PairInfo from 'shared/PairInfo';
import PriceChange from 'shared/PriceChange';

const PAGE_SIZE = 7;
const FPIPositionHistory: React.FC<{ fpiKey?: string; className?: string }> = ({
  fpiKey,
  className,
}) => {
  const [page, setPage] = useState(1);
  const history = useFpiPositionHistory({
    fpiKey,
    offset: (page - 1) * PAGE_SIZE,
    limit: PAGE_SIZE,
  });

  if (!history.data || history.isLoading) return <></>;

  return (
    <div className={className}>
      <h1 className="mb-4 text-lg font-semibold text-white">
        Positions History
      </h1>

      <div className="overflow-auto">
        <div className="min-w-[800px] rounded-3xl bg-white/5 p-6">
          <div className="grid grid-cols-6 gap-6 text-white/60">
            <div className="pl-4 text-sm">Pairs</div>
            <div className="text-center text-sm">Strategy</div>
            <div className="text-center text-sm">P/L</div>
            <div className="text-center text-sm">Entry Point</div>
            <div className="text-center text-sm">Exit Point</div>
            <div className="text-center text-sm">Status</div>
            <div className="col-span-6 border-b border-b-white/10" />

            {history.data.position_history.map(h => (
              <React.Fragment key={h.entry_time + h.exit_time}>
                <div className="flex">
                  <PairInfo
                    title={h.pair.title}
                    base={h.pair.base.name}
                    quote={h.pair.quote.name}
                  />
                </div>

                <div className="flex items-center justify-center text-xs text-white/40">
                  {h.position_side.toUpperCase()}
                </div>

                <div className="flex items-center justify-center">
                  <PriceChange value={h.pnl} valueToFixed />
                </div>

                <div className="flex flex-col items-center justify-center">
                  <div className="text-sm text-white/80">
                    ${numerable.format(h.entry_price, '0,0.00')}
                  </div>
                  <div className="text-xs text-white/40">
                    {dayjs(h.entry_time).format('HH:MM, MMMM DD')}
                  </div>
                </div>

                <div className="flex flex-col items-center justify-center">
                  {h.exit_time && (
                    <>
                      <div className="text-sm text-white/80">
                        ${numerable.format(h.exit_price, '0,0.00')}
                      </div>
                      <div className="text-xs text-white/40">
                        {dayjs(h.exit_time).format('HH:MM, MMMM DD')}
                      </div>
                    </>
                  )}
                </div>

                <div className="flex items-center justify-center">
                  <div
                    className={clsx(
                      'inline-block w-24 rounded-full px-4 py-2 text-center',
                      h.exit_time
                        ? 'bg-white/20 text-white/40'
                        : 'bg-success/20 text-success',
                    )}
                  >
                    {h.exit_time ? 'Closed' : 'Open'}
                  </div>
                </div>
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
      <Pager
        total={10}
        active={page}
        onChange={setPage}
        className="mx-auto mt-4 justify-center"
      />
    </div>
  );
};

export default FPIPositionHistory;
