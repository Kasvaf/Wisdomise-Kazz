import { clsx } from 'clsx';
import { Button } from 'shared/v1-components/Button';
import useSensibleSteps from 'modules/autoTrader/PageTrade/AdvancedSignalForm/useSensibleSteps';
import { type Surface } from 'utils/useSurface';

export default function SensibleSteps({
  token,
  balance,
  value,
  onClick,
  surface = 2,
  className,
  mode,
}: {
  token?: string;
  balance?: number | null;
  value?: string;
  mode?: 'buy' | 'sell';
  onClick: (value: string) => void;
  surface?: Surface;
  className?: string;
}) {
  const noMax =
    token === 'the-open-network' ||
    token === 'solana' ||
    token === 'wrapped-solana';
  const steps = useSensibleSteps(balance, noMax);

  return (
    <div className={clsx('mb-3 flex gap-1.5', className)}>
      {steps.map(({ label, value: stepValue }) => (
        <Button
          key={stepValue}
          size="xs"
          variant={mode ? 'outline' : stepValue === value ? 'primary' : 'ghost'}
          className={clsx(
            '!h-6 grow !px-2 enabled:hover:!bg-v1-background-brand enabled:active:!bg-v1-background-brand',
            mode === 'buy' &&
              '!border-v1-border-positive !text-v1-content-positive enabled:hover:!bg-v1-background-positive-subtle',
            mode === 'sell' &&
              '!border-v1-border-negative !text-v1-content-negative enabled:hover:!bg-v1-background-negative-subtle',
          )}
          disabled={!balance}
          onClick={() => onClick(stepValue)}
          surface={surface}
        >
          {label}
        </Button>
      ))}
    </div>
  );
}
