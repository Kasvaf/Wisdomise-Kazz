import { useEffect, useMemo, useState } from 'react';
import { NavigateButtons } from '../../NavigateButtons';
import { StepContent } from '../../StepContent';
import socialRadar from './social-radar.png';
import technicalRadar from './technical-radar.png';
import whaleRadar from './whale-radar.png';
import background from './background.png';
import { ReactComponent as Check } from './check.svg';
import { ReactComponent as UnCheck } from './uncheck.svg';

const useApproches = () => {
  return useMemo<
    Array<{
      value: string;
      title: string;
      description: string;
      logo: string;
    }>
  >(
    () => [
      {
        value: 'social-radar',
        title: 'Discover Coins From Social Media',
        description:
          'Wisdomise Social Radar scans Twitter and premium alpha groups, uncovering top opportunities and saving you $3,000+ in fees.',
        logo: socialRadar,
      },
      {
        value: 'whale-radar',
        title: 'Discover Coins From Whales',
        description:
          'Track Top Whales, Hottest Tokens They Hold and Trade, and Market Moves Influenced by Crypto Whales',
        logo: technicalRadar,
      },
      {
        value: 'technical-radar',
        title: 'Discover Coins Using Indicators',
        description:
          'Wisdomise uses indicators and AI to analyze coins, uncovering the best short-term trading opportunities.',
        logo: whaleRadar,
      },
    ],
    [],
  );
};

export function ApprochStep({
  value: initialValue,
  onNext,
  onPrev,
}: {
  value?: string[];
  onNext?: (newValue: string[]) => void;
  onPrev?: () => void;
}) {
  const approches = useApproches();
  const [value, setValue] = useState(initialValue);
  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  return (
    <>
      <StepContent className="flex flex-col items-center justify-start gap-3 xl:justify-center xl:gap-4">
        <h2 className="text-center text-lg font-medium text-v1-content-primary xl:text-start xl:text-xl">
          {'What Do You Want to Achieve with Wisdomise?'}
        </h2>
        <p className="text-center text-xs font-normal text-white/50 xl:text-start xl:text-sm">
          {'Select all that applies'}
        </p>
        <div className="mt-4 flex w-full flex-col flex-nowrap items-center justify-center gap-4 xl:flex-row">
          {approches.map(x => (
            <div
              key={x.value}
              className="relative flex w-full max-w-full shrink-0 grow cursor-pointer flex-col items-center justify-between gap-4 overflow-hidden rounded-2xl bg-v1-surface-l2 p-4 transition-all hover:brightness-125 mobile:flex-row mobile:gap-3 mobile:p-5 xl:max-w-[350px]"
              tabIndex={-1}
              onClick={() =>
                setValue(p =>
                  p?.includes(x.value)
                    ? p.filter(y => y !== x.value)
                    : [...(p ?? []), x.value],
                )
              }
            >
              <img
                src={background}
                className="absolute left-0 top-0 size-full object-cover opacity-20"
              />
              <div className="absolute -top-3 left-1/2 size-20 -translate-x-1/2 rounded-full bg-wsdm-gradient opacity-55 blur-3xl" />
              <div className="shrink-0 self-start mobile:self-auto">
                {value?.includes(x.value) ? (
                  <Check className="size-6" />
                ) : (
                  <UnCheck className="size-6" />
                )}
              </div>
              <div className="mx-auto inline-flex size-14 shrink-0 items-center justify-center rounded-full bg-v1-background-secondary/30 mobile:size-12">
                <img
                  src={x.logo}
                  className="size-8 object-contain mobile:size-6"
                />
              </div>
              <div className="relative flex h-full min-h-24 flex-col items-center justify-center gap-3 p-4 text-center mobile:items-start mobile:gap-1 mobile:p-0 mobile:text-start">
                <p className="text-sm font-medium">{x.title}</p>
                <p className="overflow-visible text-xs font-normal leading-normal text-white/70">
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
        allowNext={(value?.length ?? 0) > 0}
        onNext={() => onNext?.(value ?? [])}
        onPrev={onPrev}
      />
    </>
  );
}
