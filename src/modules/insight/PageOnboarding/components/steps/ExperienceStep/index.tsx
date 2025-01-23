import { useEffect, useMemo, useState } from 'react';
import { NavigateButtons } from '../../NavigateButtons';
import { StepContent } from '../../StepContent';
import amateurBg from './amateur.png';
import technicalBg from './technical.png';
import degenBg from './degen.png';
import { ReactComponent as Check } from './check.svg';
import { ReactComponent as UnCheck } from './uncheck.svg';

const useTypes = () => {
  return useMemo<
    Array<{
      value: string;
      title: string;
      description: string;
      background: string;
    }>
  >(
    () => [
      {
        value: 'amateur',
        title: 'Just Getting Started?',
        description:
          'Looking for easy to understand alpha and insights for coins to invest in.',
        background: amateurBg,
      },
      {
        value: 'technical',
        title: 'Technical Trader',
        description:
          'Looking for confirmations and indicators combined with AI',
        background: technicalBg,
      },
      {
        value: 'degen',
        title: 'Degen Trader',
        description:
          'Looking to ape in high risk coins with a potential of big returns',
        background: degenBg,
      },
    ],
    [],
  );
};

export function ExperienceStep({
  value: initialValue,
  onNext,
}: {
  value?: string;
  onNext?: (newValue: string) => void;
}) {
  const types = useTypes();
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  return (
    <>
      <StepContent className="flex flex-col items-center justify-start gap-3 xl:justify-center xl:gap-4">
        <h2 className="text-center text-lg font-medium text-v1-content-primary xl:text-start xl:text-xl">
          {'What Kind of a Trader Are You?'}
        </h2>
        <p className="text-center text-xs font-normal text-white/50 xl:text-start xl:text-sm">
          {'Let us know and we will guide you to tool that suits you best'}
        </p>
        <div className="mt-4 flex w-full flex-col flex-nowrap items-center justify-center gap-4 xl:flex-row">
          {types.map(x => (
            <div
              key={x.value}
              className="relative flex w-full max-w-full shrink-0 grow cursor-pointer flex-col justify-between rounded-2xl bg-v1-surface-l2 transition-all hover:brightness-125 xl:max-w-[350px]"
              tabIndex={-1}
              onClick={() => setValue(x.value)}
            >
              <img
                src={x.background}
                className="mx-auto h-80 w-72 max-w-full object-contain"
              />
              <div className="absolute top-64 h-16 w-full bg-gradient-to-t from-v1-surface-l2 to-transparent" />
              <div className="p-6">
                <div className="mb-2 flex items-center gap-2 text-sm font-medium">
                  {x.value === value ? (
                    <Check className="size-6 shrink-0" />
                  ) : (
                    <UnCheck className="size-6 shrink-0" />
                  )}
                  {x.title}
                </div>
                <p className="text-xs font-normal leading-normal text-white/70">
                  {x.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </StepContent>
      <NavigateButtons
        nextText="Next"
        prevText="Previous"
        showPrev={false}
        allowNext={!!value}
        onNext={() => onNext?.(value ?? types[0].value)}
      />
    </>
  );
}
