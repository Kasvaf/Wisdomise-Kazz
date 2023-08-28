import { clsx } from 'clsx';
import makeArray from 'utils/makeArray';

export interface SegmentItem {
  start: number;
  end: number;
  color: 'success' | 'error';
  weight: number;
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

      <div className="absolute left-0 w-full">
        {items.map(({ start, end, color, hover, weight }) => {
          const width = 100 * (Math.min(end, 1) - Math.max(start, 0));
          const height = 8;

          return (
            <div
              key={start}
              className={clsx(
                'absolute left-0 w-10 border-2 border-transparent',
                'group hover:border-white',
                color === 'success' ? 'bg-success' : 'bg-error',

                'rounded-full',
                start < 0 && 'rounded-l-none',
                end > 1 && 'rounded-r-none',
              )}
              style={{
                width: width.toFixed(5) + '%',
                marginLeft: (100 * Math.max(start, 0)).toFixed(5) + '%',
                height: height.toFixed(3) + 'px',
                top: (-height / 2).toFixed(3) + 'px',
                backgroundColor:
                  color === 'success'
                    ? `hsl(143deg 100% ${100 - 1 * 50}% / ${weight})`
                    : `hsl(0deg 100% ${100 - 1 * 50}% / ${weight})`,
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
          );
        })}
      </div>
    </div>
  );
};

export default RowGraph;
