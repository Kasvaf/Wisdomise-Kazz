import { ReactComponent as GaugeBase } from './images/Guage-Base.svg';
import { ReactComponent as GaugeArrow } from './images/Gauge-Arrow.svg';

export default function SideSuggestGauge({ measure }: { measure: -1 | 0 | 1 }) {
  return (
    <div className="relative">
      <GaugeBase />
      <GaugeArrow
        style={{ rotate: `${measure * 90}deg` }}
        className="absolute top-[1px] origin-center"
      />
    </div>
  );
}
