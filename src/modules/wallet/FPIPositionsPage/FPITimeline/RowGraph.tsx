import { clsx } from 'clsx';
import makeArray from 'utils/makeArray';

export interface SegmentItem {
  start: number;
  end: number;
  color: 'success' | 'error';
  hover?: JSX.Element;
}

interface Props {
  items: SegmentItem[];
  segments: number;
  className?: string;
}

const RowGraph: React.FC<Props> = ({ segments, items, className }) => {
  return (
    <div className={clsx('relative', className)}>
      <div className="flex items-center">
        {makeArray(segments).map(i => (
          <div key={i} className="h-1 grow border-b border-r border-white/10" />
        ))}
      </div>

      <div className="absolute left-0 top-[-3px] w-full">
        {items.map(({ start, end, color, hover }) => (
          <div
            key={start}
            className={clsx(
              'absolute left-0 top-0 h-3 w-10 rounded-full border-2 border-transparent',
              'group hover:border-white',
              color === 'success' ? 'bg-success' : 'bg-error',
              start < 0 && 'rounded-l-none',
              end > 1 && 'rounded-r-none',
            )}
            style={{
              width:
                (100 * (Math.min(end, 1) - Math.max(start, 0))).toFixed(5) +
                '%',
              marginLeft: (100 * Math.max(start, 0)).toFixed(5) + '%',
            }}
          >
            <div
              className={clsx(
                'absolute bottom-4 z-10 hidden w-max group-hover:block',
                start < 0.5 ? 'left-0' : 'right-0',
              )}
            >
              {hover}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RowGraph;
