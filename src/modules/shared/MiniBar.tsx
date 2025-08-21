import { clsx } from 'clsx';
import type { FC } from 'react';

export const MiniBar: FC<{
  className?: string;
  value: number; // -1 | 0 | 1
  width?: number;
  height?: number;
}> = ({ className, value, width = 20, height = 16 }) => {
  const barValue = Math.round(Math.abs(value) * 3);
  const barWidth = Math.floor(width / 4.5);
  const gap = (width - barWidth * 3) / 2;
  return (
    <div
      className={clsx('inline-flex items-end justify-between', className)}
      style={{
        width: `${width}px`,
        height: `${height}px`,
        gap: `${gap}px`,
      }}
    >
      {[1, 2, 3].map(size => (
        <div
          className={clsx(
            'shrink-0 rounded-full',
            size === 1 ? 'h-1/2' : size === 2 ? 'h-3/4' : 'h-full',
            barValue < size
              ? 'bg-white/10'
              : value < 0
                ? 'bg-v1-content-negative'
                : 'bg-v1-content-positive',
          )}
          key={size}
          style={{
            width: `${barWidth}px`,
          }}
        />
      ))}
    </div>
  );
};
