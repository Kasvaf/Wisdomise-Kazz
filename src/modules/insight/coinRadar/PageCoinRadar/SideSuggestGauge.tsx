import { GaugeArrowIcon, GaugeBaseIcon } from './assets';

export default function SideSuggestGauge({ measure }: { measure: -1 | 0 | 1 }) {
  return (
    <div className="relative">
      <GaugeBaseIcon />
      <GaugeArrowIcon
        style={{ rotate: `${measure * 90}deg` }}
        className="absolute top-[1px] origin-center"
      />
    </div>
  );
}
