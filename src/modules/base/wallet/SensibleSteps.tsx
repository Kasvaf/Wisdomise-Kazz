import { clsx } from 'clsx';
import { Button } from 'shared/v1-components/Button';
import useSensibleSteps from 'modules/base/wallet/useSensibleSteps';
import { type Surface } from 'utils/useSurface';

export default function SensibleSteps({
  token,
  balance,
  value,
  onChange,
  surface = 2,
  className,
}: {
  token?: string;
  balance?: number | null;
  value?: string;
  onChange: (value: string) => void;
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
          variant={stepValue === value ? 'primary' : 'ghost'}
          className="!h-6 grow !px-2 enabled:hover:!bg-v1-background-brand enabled:active:!bg-v1-background-brand"
          onClick={() => onChange(stepValue)}
          surface={surface}
        >
          {label}
        </Button>
      ))}
    </div>
  );
}
