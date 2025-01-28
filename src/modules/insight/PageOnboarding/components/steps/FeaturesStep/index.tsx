import { type ReactNode, useEffect, useMemo, useRef } from 'react';
import { useSessionStorage } from 'usehooks-ts';
import { clsx } from 'clsx';
import { bxChevronLeft, bxChevronRight } from 'boxicons-quasar';
import Icon from 'shared/Icon';
import { Button } from 'shared/v1-components/Button';
import { NavigateButtons } from '../../NavigateButtons';
import { StepContent } from '../../StepContent';
import socialRadar from './social-radar.mp4';
import whaleRadar from './whale-radar.mp4';
import technicalRadar from './technical-radar.mp4';
import screener from './screener.mp4';
import coinRadarOverview from './coin-radar-overview.mp4';

const useFeatures = () => {
  return useMemo<
    Array<{
      label: string;
      title: ReactNode;
      description: ReactNode;
      video: string;
    }>
  >(
    () => [
      {
        label: '01 Social Radar',
        title: (
          <>
            {'Uncover The Coins Shaping '}
            <span className="block whitespace-nowrap bg-wsdm-gradient bg-clip-text text-transparent md:inline">
              {'Social Trends'}
            </span>
          </>
        ),
        description:
          'Analyze trending coins based on 100,000 social media accounts and posts, extracted using AI. Understand market sentiment and capitalize on viral opportunities.',
        video: socialRadar,
      },
      {
        label: '02 Whale Radar',
        title: (
          <>
            {'Track The Moves of '}
            <span className="block whitespace-nowrap bg-wsdm-gradient bg-clip-text text-transparent md:inline">
              {'Top Investors'}
            </span>
          </>
        ),
        description:
          'Constantly monitor different wallets using AI to extract the best coins and identify high-value investment opportunities. Stay one step ahead by following smart money strategies.',
        video: whaleRadar,
      },
      {
        label: '03 Technical Radar',
        title: (
          <>
            {'Find Optimal Short-Term '}
            <span className="block whitespace-nowrap bg-wsdm-gradient bg-clip-text text-transparent md:inline">
              {'Trading Opportunities'}
            </span>
          </>
        ),
        description:
          'Use advanced indicators and AI, including RSI and MACD, to discover the best coins for short-term trading. Leverage momentum and trend analysis to maximize gains.',
        video: technicalRadar,
      },
      {
        label: '04 Screener',
        title: (
          <>
            {'Never Miss Another '}
            <span className="block whitespace-nowrap bg-wsdm-gradient bg-clip-text text-transparent md:inline">
              {'Opportunity'}
            </span>
          </>
        ),
        description:
          'Set custom alerts on any of the radars to get notified whenever a potential opportunity arises. Stay informed and act at the right moment to maximize your profits.',
        video: screener,
      },
      {
        label: '05 Coin Overview',
        title: (
          <>
            {'Spot Correlations '}
            <span className="block whitespace-nowrap bg-wsdm-gradient bg-clip-text text-transparent md:inline">
              {'Across Radars'}
            </span>
          </>
        ),
        description:
          'Get a curated list of coins with cross-radar confirmations. Scan through multiple indicators to identify coins with the strongest potential based on combined data insights.',
        video: coinRadarOverview,
      },
    ],
    [],
  );
};

export function FeaturesStep({
  onNext,
  onPrev,
}: {
  onNext?: () => void;
  onPrev?: () => void;
}) {
  const features = useFeatures();
  const [value, setValue] = useSessionStorage('onboarding-feature-page', 0);
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    void root.current
      ?.querySelector<HTMLVideoElement>(`[data-index="${value}"] video`)
      ?.play?.();
  }, [value]);

  return (
    <>
      <StepContent className="flex flex-col items-center justify-center">
        <div className="mb-6 flex flex-wrap items-center justify-center gap-4 gap-y-2 text-sm md:text-base xl:gap-10">
          <div className="order-last h-0 shrink-0 basis-full xl:hidden" />
          <Button
            className="order-last !size-6 !rounded-full !p-0 xl:order-none"
            variant="white"
            size="xs"
            onClick={() => setValue(p => p - 1)}
            disabled={value === 0}
          >
            <Icon name={bxChevronLeft} />
          </Button>
          {features.map((x, i) => (
            <span
              key={x.label}
              className={clsx(
                'cursor-pointer transition-all hover:text-v1-content-primary',
                i === value
                  ? 'text-v1-content-primary'
                  : 'text-v1-content-secondary',
              )}
              tabIndex={-1}
              onClick={() => setValue(i)}
            >
              {x.label}
            </span>
          ))}
          <Button
            className="order-last !size-6 !rounded-full !p-0 xl:order-none"
            variant="white"
            size="xs"
            onClick={() => setValue(p => p + 1)}
            disabled={value === features.length - 1}
          >
            <Icon name={bxChevronRight} />
          </Button>
        </div>
        <div className="relative flex flex-row overflow-hidden" ref={root}>
          {features.map((x, i) => (
            <div
              key={x.label}
              className={clsx(
                'h-auto w-full shrink-0 grow overflow-hidden',
                i !== value && 'absolute size-0 opacity-0',
              )}
              data-index={i}
            >
              <div className="mx-auto mb-1 text-center text-xl font-medium text-v1-content-primary xl:text-3xl">
                {x.title}
              </div>
              <p className="mx-auto mb-6 max-w-3xl text-center text-xs font-normal text-white/70 xl:text-sm">
                {x.description}
              </p>
              <video
                width="900"
                height="640"
                muted={true}
                loop={true}
                playsInline={true}
                preload="auto"
                autoPlay={false}
                controls={false}
                className="mx-auto w-full object-cover md:w-[612px] 2xl:w-[792px]"
              >
                <source src={x.video} type="video/mp4" />
              </video>
            </div>
          ))}
        </div>
      </StepContent>
      <NavigateButtons
        nextText="Next"
        prevText="Previous"
        onNext={() => {
          if (value === features.length - 1) {
            onNext?.();
            return;
          }
          setValue(p => p + 1);
        }}
        onPrev={() => {
          if (value === 0) {
            onPrev?.();
            return;
          }
          setValue(p => p - 1);
        }}
      />
    </>
  );
}
