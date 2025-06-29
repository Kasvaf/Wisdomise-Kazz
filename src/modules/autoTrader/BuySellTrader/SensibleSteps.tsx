import { clsx } from 'clsx';
import { Button } from 'shared/v1-components/Button';
import { type Surface } from 'utils/useSurface';
import { usePresetAmount } from 'modules/autoTrader/BuySellTrader/BtnInstantTrade/usePresetAmount';
import { roundSensible } from 'utils/numbers';

export default function SensibleSteps({
  balance,
  onClick,
  surface = 2,
  className,
  btnClassName,
  mode,
}: {
  token?: string;
  balance?: number | null;
  value?: string;
  mode?: 'buy' | 'sell';
  onClick: (value: string) => void;
  surface?: Surface;
  className?: string;
  btnClassName?: string;
}) {
  const { buyPreset, sellPreset, isPercentage } = usePresetAmount();
  const presetOptions = (mode === 'buy' ? buyPreset : sellPreset)?.map(v => ({
    value:
      isPercentage && mode === 'sell'
        ? v === 100
          ? String(balance)
          : roundSensible((v / 100) * (balance ?? 0))
        : String(v),
    label: v,
  }));

  return (
    <div className={clsx('flex gap-1.5', className)}>
      {presetOptions.map(({ label, value: stepValue }) => (
        <Button
          key={label}
          size="2xs"
          variant="ghost"
          className={clsx('grow', btnClassName)}
          onClick={() => onClick(stepValue)}
          surface={surface}
        >
          {label}
          {isPercentage && mode === 'sell' && '%'}
        </Button>
      ))}
    </div>
  );
}
