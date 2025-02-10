import { bxLeftArrowAlt, bxsCheckCircle } from 'boxicons-quasar';
import { clsx } from 'clsx';
import { Fragment, useMemo, type ReactNode } from 'react';
import Icon from 'shared/Icon';
import { Button } from 'shared/v1-components/Button';

export function OnboardingView<V extends string>({
  className,
  onChange,
  steps: rawSteps,
  step,
  loading,
}: {
  className?: string;
  onChange?: (newStep: V) => void;
  steps: Array<{
    key: V;
    label: ReactNode;
    element: ReactNode;
  }>;
  step: V;
  loading?: boolean;
}) {
  const steps = useMemo(() => {
    const activeStepIndex = rawSteps.findIndex(x => x.key === step);
    return rawSteps.map((x, index) => ({
      ...x,
      isPassed: index < activeStepIndex,
      isActive: index === activeStepIndex,
    }));
  }, [rawSteps, step]);

  return (
    <div
      className={clsx(
        'fixed left-0 top-0 flex h-dvh w-dvw bg-v1-background-primary text-v1-content-primary',
        loading && 'pointer-events-none animate-pulse blur-sm transition-all',
        className,
      )}
    >
      <div className="absolute -top-1/3 left-1/2 !size-[520px] -translate-x-1/2 bg-white/25 blur-[200px] mobile:!size-[430px]" />
      <div className="relative mx-auto flex w-full max-w-7xl grow flex-col">
        <div className="hidden shrink-0 items-center justify-start px-4 pt-4 mobile:flex">
          <Button
            size="md"
            variant="ghost"
            onClick={() =>
              onChange?.(steps[steps.findIndex(x => x.key === step) - 1].key)
            }
            block
            className={clsx(
              'w-md shrink-0',
              step === steps[0].key && 'opacity-0',
            )}
          >
            <Icon name={bxLeftArrowAlt} />
          </Button>
        </div>

        <div
          className={clsx(
            'relative flex w-full shrink-0 flex-nowrap items-start justify-between gap-1 p-4 xl:pt-6',
            className,
          )}
        >
          {steps.map(x => (
            <div
              key={x.key}
              className={clsx(
                'group flex shrink basis-full cursor-default flex-col items-start gap-3 transition-all',
                x.isPassed ? 'cursor-pointer' : 'cursor-default',
              )}
              onClick={() => (x.isPassed ? onChange?.(x.key) : null)}
              tabIndex={-1}
            >
              <div
                className={clsx(
                  'h-2 w-full rounded-full transition-all',
                  x.isPassed || x.isActive ? 'bg-white' : 'bg-white/10',
                )}
              />
              <div
                className={clsx(
                  'flex items-center gap-2',
                  'w-full rounded-full text-sm font-medium mobile:text-xs',
                  x.isPassed || x.isActive ? 'text-white' : 'text-white/50',
                )}
              >
                <Icon
                  name={bxsCheckCircle}
                  size={20}
                  className={clsx(
                    'transition-all',
                    !x.isPassed && '-translate-x-3 opacity-0',
                  )}
                />
                <span
                  className={clsx(
                    'transition-all',
                    (!x.isPassed || x.isActive) && '-translate-x-6',
                    x.isPassed && 'opacity-0 group-hover:opacity-100',
                  )}
                >
                  {x.label}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="relative flex grow flex-col overflow-hidden">
          {steps
            .filter(x => x.key === step)
            .map(x => (
              <Fragment key={x.key}>{x.element}</Fragment>
            ))}
        </div>
      </div>
    </div>
  );
}
