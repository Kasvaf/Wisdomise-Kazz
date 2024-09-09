import { useEffect, useState } from 'react';
import { ReactComponent as BaseIcon } from './base.svg';
import { ReactComponent as ArrowIcon } from './arrow.svg';
import LinesIcon from './lines.png';

export function SentimentGuage({
  measure,
}: {
  measure?: number | null /* -1 to 1 */;
}) {
  const [rotate, setRotate] = useState(-90);
  useEffect(() => {
    setRotate(
      typeof measure === 'number' ? Math.max(Math.min(measure, 1), -1) * 90 : 0,
    );
  }, [measure]);
  return (
    <div className="relative overflow-hidden">
      <BaseIcon className="size-full" />
      <img
        src={LinesIcon}
        className="absolute top-[29%] h-[19%] w-full scale-x-[0.41]"
        alt="gauge lines"
      />
      <ArrowIcon
        style={{ rotate: `${rotate ?? 0}deg` }}
        className="absolute top-0 size-full origin-center transition-all delay-75 duration-500"
      />
    </div>
  );
}
