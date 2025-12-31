import { bxsCheckCircle, bxX } from 'boxicons-quasar';
import { clsx } from 'clsx';
import { Fragment, type ReactNode, useMemo } from 'react';
import Icon from 'shared/Icon';
import { Button } from 'shared/v1-components/Button';

export function OnboardingView<V extends string>({
  className,
  onChange,
  onClose,
  steps: rawSteps,
  step,
  loading,
  fullscreen = true,
}: {
  className?: string;
  onChange?: (newStep: V) => void;
  onClose?: (url?: string) => unknown;
  steps: Array<{
    key: V;
    label?: ReactNode;
    element: ReactNode;
  }>;
  step: V;
  loading?: boolean;
  fullscreen?: boolean;
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
        fullscreen && 'fixed top-0 left-0 flex h-dvh w-dvw',
        'text-v1-content-primary',
        loading && 'pointer-events-none animate-pulse blur-sm transition-all',
        className,
      )}
    >
      <div className="relative mx-auto flex w-full max-w-7xl grow flex-col">
        <div className="flex shrink-0 items-center justify-between px-4 pt-4">
          {/* <Button */}
          {/*   size="md" */}
          {/*   variant="ghost" */}
          {/*   onClick={() => */}
          {/*     onChange?.(steps[steps.findIndex(x => x.key === step) - 1].key) */}
          {/*   } */}
          {/*   block */}
          {/*   className={clsx( */}
          {/*     'invisible w-md shrink-0 max-md:visible', */}
          {/*     step === steps[0].key && 'opacity-0', */}
          {/*   )} */}
          {/* > */}
          {/*   <Icon name={bxLeftArrowAlt} /> */}
          {/* </Button> */}

          {onClose && (
            <Button
              block
              className="w-md shrink-0"
              onClick={() => onClose('/')}
              size="md"
              variant="ghost"
            >
              <Icon name={bxX} />
            </Button>
          )}
        </div>

        <div
          className={clsx(
            'relative flex w-full shrink-0 flex-nowrap items-start justify-between gap-1 p-4 xl:pt-6',
            className,
          )}
        >
          {steps.map(x => (
            <div
              className={clsx(
                'group flex shrink basis-full cursor-default flex-col items-start gap-3 transition-all',
                x.isPassed ? 'cursor-pointer' : 'cursor-default',
              )}
              key={x.key}
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
                  'w-full rounded-full font-medium text-sm max-md:text-xs',
                  x.isPassed || x.isActive ? 'text-white' : 'text-white/50',
                )}
              >
                <Icon
                  className={clsx(
                    'transition-all',
                    !x.isPassed && '-translate-x-3 opacity-0',
                  )}
                  name={bxsCheckCircle}
                  size={20}
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

        <div className="relative flex grow flex-col overflow-auto">
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
