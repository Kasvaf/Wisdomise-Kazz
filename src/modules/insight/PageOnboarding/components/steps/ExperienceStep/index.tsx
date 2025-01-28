import { useEffect, useMemo, useState } from 'react';
import { clsx } from 'clsx';
import { bxChevronDownCircle, bxChevronUpCircle } from 'boxicons-quasar';
import useIsMobile from 'utils/useIsMobile';
import Icon from 'shared/Icon';
import { NavigateButtons } from '../../NavigateButtons';
import { StepContent } from '../../StepContent';
import amateurBg from './amateur.png';
import technicalBg from './technical.png';
import degenBg from './degen.png';
import { ReactComponent as Check } from './check.svg';
import { ReactComponent as UnCheck } from './uncheck.svg';
import background from './background.png';

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
  const isMobile = useIsMobile();
  const types = useTypes();
  const [value, setValue] = useState(initialValue);
  const [expandedType, setExpandedType] = useState(initialValue);

  useEffect(() => {
    setValue(initialValue);
    setExpandedType(initialValue);
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
              className="relative flex w-full max-w-full shrink-0 grow cursor-pointer flex-col justify-between overflow-hidden rounded-2xl bg-v1-surface-l2 transition-all hover:brightness-125 mobile:flex-col-reverse mobile:py-4 xl:max-w-[350px]"
              tabIndex={-1}
              onClick={() => {
                setValue(x.value);
                setExpandedType(p => (p === x.value ? undefined : x.value));
              }}
            >
              <img
                src={background}
                className="absolute left-0 top-0 size-full object-cover opacity-15"
              />
              <img
                src={x.background}
                className={clsx(
                  'mx-auto w-72 max-w-full overflow-hidden object-contain transition-all',
                  (expandedType && expandedType === x.value) || !isMobile
                    ? 'h-80'
                    : 'h-0',
                )}
              />
              <div className="absolute -bottom-5 -right-5 hidden size-1/2 rounded-full bg-wsdm-gradient opacity-40 blur-[100px] mobile:block" />
              <div className="p-6">
                <div className="relative mb-2 flex items-center gap-2 text-sm font-medium">
                  {x.value === value ? (
                    <Check className="size-6 shrink-0" />
                  ) : (
                    <UnCheck className="size-6 shrink-0" />
                  )}
                  {x.title}
                </div>
                <p className="relative text-xs font-normal leading-normal text-white/70">
                  {x.description}
                </p>
              </div>
              <Icon
                name={
                  expandedType && expandedType === x.value
                    ? bxChevronUpCircle
                    : bxChevronDownCircle
                }
                size={19}
                className={clsx(
                  'absolute bottom-4 right-4 hidden mobile:block',
                  expandedType && expandedType === x.value
                    ? 'opacity-70'
                    : 'opacity-35',
                )}
              />
            </div>
          ))}
        </div>
      </StepContent>
      <NavigateButtons
        nextText="Next"
        showPrev={false}
        allowNext={!!value}
        onNext={() => onNext?.(value ?? types[0].value)}
      />
    </>
  );
}
