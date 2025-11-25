import { clsx } from 'clsx';
import useSensibleSteps from 'modules/base/wallet/useSensibleSteps';
import { WRAPPED_SOLANA_SLUG } from 'services/chains/constants';
import { Button } from 'shared/v1-components/Button';
import type { Surface } from 'utils/useSurface';

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
    token === WRAPPED_SOLANA_SLUG;
  const steps = useSensibleSteps(balance, noMax);

  return (
    <div className={clsx('flex gap-1', className)}>
      {steps.map(({ label, value: stepValue }) => (
        <Button
          className="grow"
          key={stepValue}
          onClick={() => onChange(stepValue)}
          size="2xs"
          surface={surface}
          variant="ghost"
        >
          {label}
        </Button>
      ))}
    </div>
  );
}
