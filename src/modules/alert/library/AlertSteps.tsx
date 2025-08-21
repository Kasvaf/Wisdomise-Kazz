import { clsx } from 'clsx';
import type { ComponentType, ReactNode } from 'react';

interface Step {
  value: number;
  icon: ComponentType<{ className?: string }>;
  label?: ReactNode;
}

export function AlertSteps({
  steps,
  value,
  className,
}: {
  steps: Array<Step | undefined | false | null>;
  value: number;
  className?: string;
}) {
  const nonNullishSteps = steps.filter(step => !!step);
  const passedSteps = new Set(
    nonNullishSteps
      .filter(
        (_, index, self) => index <= self.findIndex(r => r.value === value),
      )
      .map(step => step.value),
  );
  const stepsWithGaps = nonNullishSteps.flatMap((step, i, self) =>
    i === self.length - 1 ? [step] : [step, null],
  );

  return (
    <div
      className={clsx(
        'flex w-full max-w-xs items-start justify-center gap-2',
        className,
      )}
    >
      {stepsWithGaps.map((step, index, self) =>
        step === null ? (
          <div
            className={clsx(
              'mt-3 h-px w-full max-w-32 grow overflow-hidden bg-gradient-to-r bg-transparent from-white',
              passedSteps.has((self[index - 1] as Step).value)
                ? 'to-white'
                : 'to-transparent',
              'transition-all duration-300',
            )}
            key={index}
          />
        ) : (
          <div
            className={clsx(
              'relative flex size-12 shrink-0 flex-col items-center justify-center overflow-visible',
              passedSteps.has((self[index] as Step).value)
                ? 'border-v1-border-brand'
                : 'border-transparent opacity-80',
            )}
            key={index}
          >
            <div
              className={clsx(
                'size-12 shrink-0 overflow-hidden rounded-lg border',
                'transition-all duration-300',
                passedSteps.has((self[index] as Step).value)
                  ? 'border-v1-border-brand bg-v1-surface-l3'
                  : 'border-transparent bg-v1-surface-l3',
              )}
            >
              <step.icon className="relative size-full" />
            </div>
            <div
              className={clsx(
                'mt-2 w-max whitespace-normal font-light text-sm',
                passedSteps.has((self[index] as Step).value)
                  ? 'text-v1-content-primary'
                  : 'text-v1-content-secondary',
              )}
            >
              {step.label}
            </div>
          </div>
        ),
      )}
    </div>
  );
}
