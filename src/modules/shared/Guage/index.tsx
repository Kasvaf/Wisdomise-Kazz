import { useEffect, useState } from 'react';
import { clsx } from 'clsx';
import { ReactComponent as Gauge } from './gauge.svg';

export function Guage({
  measure,
  className,
}: {
  measure?: number | null /* -1 to 1 */;
  className?: string;
}) {
  const [rotate, setRotate] = useState(-90);
  useEffect(() => {
    setRotate(
      typeof measure === 'number' ? Math.max(Math.min(measure, 1), -1) * 82 : 0,
    );
  }, [measure]);
  return (
    <div className={clsx('relative overflow-visible', className)}>
      <Gauge
        className="size-full"
        style={
          {
            '--rotate': `${rotate}deg`,
          } as unknown as never
        }
      />
    </div>
  );
}
