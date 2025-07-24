import { clsx } from 'clsx';
import { Button } from 'shared/v1-components/Button';
import useSensibleSteps from 'modules/base/wallet/useSensibleSteps';
import { type Surface } from 'utils/useSurface';

export default function SensibleSteps({
  token,
  balance,
  onChange,
  surface = 2,
  className,
}: {
  token?: string;
  balance?: number | null;
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
    <div className={clsx('flex gap-1', className)}>
      {steps.map(({ label, value: stepValue }) => (
        <Button
          key={stepValue}
          size="2xs"
          variant="ghost"
          className="grow"
          onClick={() => onChange(stepValue)}
          surface={surface}
        >
          {label}
        </Button>
      ))}
    </div>
  );
}
