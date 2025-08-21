import { TourProvider } from '@reactour/tour';
import { disableBodyScroll, enableBodyScroll } from 'body-scroll-lock';
import { clsx } from 'clsx';
import { trackClick } from 'config/segment';
import type { PropsWithChildren } from 'react';
import { Button } from 'shared/v1-components/Button';

const CustomTourProvider: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <TourProvider
      afterOpen={x => x && disableBodyScroll(x)}
      beforeClose={x => x && enableBodyScroll(x)}
      components={{
        Navigation: ({ steps, currentStep, setCurrentStep, setIsOpen }) => (
          <div className="mt-4 flex justify-between">
            {currentStep ? (
              <Button
                className="block"
                disabled={!currentStep}
                onClick={() => setCurrentStep(x => x - 1)}
                size="sm"
                variant="outline"
              >
                Back
              </Button>
            ) : (
              <div className="w-6" />
            )}

            <div className="flex items-center gap-2">
              {steps.map((_, i) => (
                <div
                  className={clsx(
                    'size-2 rounded-full',
                    i === currentStep
                      ? 'bg-v1-background-brand'
                      : 'bg-v1-background-disabled',
                  )}
                  key={i}
                />
              ))}
            </div>

            <Button
              className="block"
              onClick={() => {
                if (currentStep < steps.length - 1) {
                  trackClick('tour_next')();
                  setCurrentStep(x => x + 1);
                } else {
                  trackClick('tour_done')();
                  setIsOpen(false);
                }
              }}
              size="sm"
              variant="primary"
            >
              {currentStep < steps.length - 1 ? 'Next' : 'Done'}
            </Button>
          </div>
        ),
        Content: ({ content }) => (
          <div className="font-light text-sm">{content}</div>
        ),
      }}
      disableInteraction
      onClickClose={x => {
        x.setIsOpen(false);
        trackClick('tour_close')();
      }}
      onClickMask={() => {
        //
      }}
      padding={4}
      showBadge={false}
      steps={[]}
      styles={{
        popover: x => ({ ...x, background: '#1a1a1f' }),
        arrow: (x, { disabled } = {}) => ({
          ...x,
          color: disabled ? '#47496b' : '#93999f',
        }),
        maskArea: x => ({ ...x, rx: 8 }),
        close: x => ({ ...x, right: 12, top: 12 }),
      }}
    >
      {children}
    </TourProvider>
  );
};

export default CustomTourProvider;
