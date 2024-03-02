import { clsx } from 'clsx';
import { ReactComponent as GaugeBase } from './images/Guage-Base.svg';
import { ReactComponent as GaugeArrow } from './images/Gauge-Arrow.svg';

export default function SideSuggestGauge({ measure }: { measure: -1 | 0 | 1 }) {
  return (
    <div className="relative">
      <GaugeBase />
      <GaugeArrow
        className={clsx(
          'absolute top-[1px] origin-center',
          measure === -1 && '-rotate-90',
          measure === 1 && 'rotate-90',
        )}
      />
    </div>
  );
}
