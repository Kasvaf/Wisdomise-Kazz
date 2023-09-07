import { clsx } from 'clsx';
import { useFpiPositionHistory } from 'api/fpi';
import { type FpiPosition } from 'api/types/investorAssetStructure';
import groupBy from 'utils/groupBy';
import Spinner from 'shared/Spinner';
import PairInfo from 'shared/PairInfo';
import PositionHover from './PositionHover';
import RowGraph, { type SegmentItem } from './RowGraph';
import useRangeSelector from './useRangeSelector';

interface Props {
  fpiKey?: string;
  className?: string;
}

const FPITimeline: React.FC<Props> = ({ fpiKey, className }) => {
  const [range, rangeSelector] = useRangeSelector();

  const history = useFpiPositionHistory({
    fpiKey,
    start_datatime: range.start.toISOString(),
    end_datetime: range.end.toISOString(),
  });

  const data = parsePositions(
    history.data?.position_history ?? [],
    range.start,
    range.end,
  );

  return (
    <div className={className}>
      <div className="mb-4 flex items-center">
        <h1 className="mr-4 text-lg font-semibold text-white">
          Positions Timeline
        </h1>
        {rangeSelector}
      </div>

      <div>
        <div className="min-w-[800px] rounded-3xl bg-white/5 p-6">
          <div className="flex flex-col text-white/60">
            {history.isLoading ? (
              <div className="flex justify-center">
                <Spinner />
              </div>
            ) : data.length > 0 ? (
              <>
                <div className="flex">
                  <div className="w-[130px] flex-none" />
                  <div className="flex-1">
                    <div className="flex items-stretch">
                      {range.segments.map(s => (
                        <div
                          key={s.label}
                          className={clsx(
                            'mb-6 flex-1 grow pb-2',
                            'flex items-end justify-start',
                            'border-b border-b-white/10',
                            'whitespace-pre text-left text-xs',
                            s.bold ? 'text-white/80' : 'text-white/10',
                          )}
                        >
                          {s.label}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {data.map(({ key, pair, items }) => (
                  <div className="flex py-3" key={key}>
                    <div className="flex w-[130px] flex-none">
                      <PairInfo
                        title={pair.title}
                        base={pair.base.name}
                        quote={pair.quote.name}
                      />
                    </div>
                    <div className="flex flex-1 items-center justify-stretch">
                      <RowGraph
                        className="flex-1"
                        segments={range.segments.length}
                        items={items}
                      />
                    </div>
                  </div>
                ))}
              </>
            ) : (
              <div className="text-sm">
                There were no positions in this time period.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

function parsePositions(positions: FpiPosition[], start: Date, end: Date) {
  const dur = +end - +start;
  const toRatio = (d: string | Date) => (+new Date(d) - +start) / dur;

  const maxPnl = positions.reduce((acc, x) => Math.max(acc, x.pnl), 0);
  const positionsGrouped = Object.entries(groupBy(positions, p => p.pair.title))
    .sort((a, b) => b[0].localeCompare(a[0]))
    .map(([key, items]) => ({
      key,
      pair: items[0].pair,
      items: items.map(p => {
        const si: SegmentItem = {
          start: toRatio(p.entry_time),
          end: toRatio(p.exit_time || end),
          color: p.pnl < 0 ? 'error' : 'success',
          weight: Math.abs(p.pnl) / maxPnl,
          hover: <PositionHover p={p} />,
        };
        return si;
      }),
    }));

  return positionsGrouped;
}

export default FPITimeline;
