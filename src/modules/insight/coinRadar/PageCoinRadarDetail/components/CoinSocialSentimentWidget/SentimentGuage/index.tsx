import { useEffect, useState } from 'react';
import { clsx } from 'clsx';
import { ReactComponent as BaseIcon } from './base.svg';
import { ReactComponent as ArrowIcon } from './arrow.svg';

export function SentimentGuage({
  measure,
  className,
}: {
  measure?: number | null /* -1 to 1 */;
  className?: string;
}) {
  const [rotate, setRotate] = useState(-90);
  useEffect(() => {
    setRotate(
      typeof measure === 'number' ? Math.max(Math.min(measure, 1), -1) * 90 : 0,
    );
  }, [measure]);
  return (
    <div className={clsx('relative overflow-visible', className)}>
      <BaseIcon className="mt-[5%] size-full scale-150" />
      <ArrowIcon
        style={{ rotate: `${rotate ?? 0}deg` }}
        className="absolute top-0 mt-[5%] size-full origin-center scale-150 transition-all delay-75 duration-500"
      />
    </div>
  );
}
