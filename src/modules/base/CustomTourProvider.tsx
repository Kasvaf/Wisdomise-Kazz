import { clsx } from 'clsx';
import { TourProvider } from '@reactour/tour';
import { type PropsWithChildren } from 'react';
import { Button } from 'shared/v1-components/Button';
import { trackClick } from 'config/segment';

const CustomTourProvider: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <TourProvider
      onClickClose={x => {
        x.setIsOpen(false);
        trackClick('tour_close')();
      }}
      onClickMask={() => {
        //
      }}
      steps={[]}
      padding={4}
      disableInteraction
      styles={{
        popover: x => ({ ...x, background: '#1a1a1f' }),
        arrow: (x, { disabled } = {}) => ({
          ...x,
          color: disabled ? '#47496b' : '#93999f',
        }),
        maskArea: x => ({ ...x, rx: 8 }),
        close: x => ({ ...x, right: 12, top: 12 }),
      }}
      components={{
        Navigation: ({ steps, currentStep, setCurrentStep, setIsOpen }) => (
          <div className="mt-4 flex justify-between">
            <Button
              className="block"
              size="sm"
              variant="outline"
              disabled={!currentStep}
              onClick={() => setCurrentStep(x => x - 1)}
            >
              Back
            </Button>

            <div className="flex items-center gap-2">
              {steps.map((_, i) => (
                <div
                  key={i}
                  className={clsx(
                    'size-2 rounded-full',
                    i === currentStep
                      ? 'bg-v1-background-brand'
                      : 'bg-v1-background-disabled',
                  )}
                />
              ))}
            </div>

            <Button
              className="block"
              size="sm"
              variant="primary"
              onClick={() => {
                if (currentStep < steps.length - 1) {
                  trackClick('tour_next')();
                  setCurrentStep(x => x + 1);
                } else {
                  trackClick('tour_done')();
                  setIsOpen(false);
                }
              }}
            >
              {currentStep < steps.length - 1 ? 'Next' : 'Done'}
            </Button>
          </div>
        ),
        Content: ({ content }) => (
          <div className="text-sm font-light">{content}</div>
        ),
      }}
      showBadge={false}
    >
      {children}
    </TourProvider>
  );
};

export default CustomTourProvider;
