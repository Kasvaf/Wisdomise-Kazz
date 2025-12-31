import { bxInfoCircle } from 'boxicons-quasar';
import clsx from 'clsx';
import { NavigateButtons } from 'modules/account/PageOnboarding/components/NavigateButtons';
import { OnboardingView } from 'modules/account/PageOnboarding/components/OnboardingView';
import { SolanaIcon } from 'modules/autoTrader/TokenActivity';
import { useLeagueLevels } from 'modules/quest/PageLeague/useLevels';
import {
  type ComponentProps,
  type FC,
  type ReactNode,
  useMemo,
  useRef,
  useState,
} from 'react';
import { HoverTooltip } from 'shared/HoverTooltip';
import Icon from 'shared/Icon';
import { Badge } from 'shared/v1-components/Badge';
import { useIntersectionObserver } from 'usehooks-ts';
import { ReactComponent as BuffIcon } from './buff.svg';
import { ReactComponent as DailyIcon } from './daily.svg';
import { ReactComponent as HeatIcon } from './heat.svg';
import { ReactComponent as PartyIcon } from './party.svg';
import { ReactComponent as PvpIcon } from './pvp.svg';
import { ReactComponent as TradeIcon } from './trade.svg';

const StepContent: FC<
  { title: ReactNode; children?: ReactNode } & Pick<
    ComponentProps<typeof NavigateButtons>,
    'nextText' | 'onNext' | 'showPrev' | 'onPrev'
  >
> = ({ title, children, ...navigateBtnProps }) => {
  const element = useRef<HTMLDivElement>(null);
  const intersection = useIntersectionObserver(element, {
    freezeOnceVisible: false,
    threshold: 0.4,
  });
  const isVisible = intersection?.isIntersecting || null;

  return (
    <div className="flex flex-col gap-4 px-4" ref={element}>
      <h2
        className={clsx(
          'mb-4 text-center font-extrabold text-2xl',
          'transition-all duration-500',
          !isVisible && '-translate-y-10 opacity-0 blur-sm',
        )}
      >
        {title}
      </h2>
      <div
        className={clsx(
          'transition-all delay-200 duration-500',
          !isVisible && '-translate-y-2 opacity-0 blur-sm',
        )}
      >
        {children}
      </div>
      <NavigateButtons
        buttonClassName="md:!max-w-max px-6"
        buttonSize="lg"
        className={clsx(
          'mx-auto max-w-max',
          'transition-all delay-500 duration-500',
          !isVisible && 'opacity-0',
        )}
        prevText="Back"
        renderHiddenButtons={false}
        showNext
        {...navigateBtnProps}
      />
    </div>
  );
};

export default function ArenaOnboarding({
  onResolve,
}: {
  onResolve: () => void;
}) {
  const leagueLevels = useLeagueLevels();
  const [step, setStep] = useState('1');

  const steps = useMemo<ComponentProps<typeof OnboardingView>['steps']>(
    () => [
      {
        key: '1',
        element: (
          <StepContent
            nextText="Next"
            onNext={() => setStep('2')}
            showPrev={false}
            title={
              <>
                How the <b className="text-v1-content-brand">Arena</b> Works
              </>
            }
          >
            <div className="mb-8 flex w-full items-center justify-center gap-0">
              <div className="flex basis-28 flex-col items-center text-center">
                <div className="mb-2 flex size-14 items-center justify-center rounded-2xl bg-v1-content-brand/20">
                  <TradeIcon />
                </div>
                <h3 className="mb-0.5 font-bold text-v1-content-brand text-xs">
                  TRADE
                </h3>
              </div>
              <div className="flex basis-28 flex-col items-center text-center">
                <div className="mb-2 flex size-14 items-center justify-center rounded-2xl bg-orange-600/20">
                  <BuffIcon />
                </div>
                <h3 className="mb-0.5 font-bold text-orange-500 text-xs">
                  GET BUFFS
                </h3>
              </div>
              <div className="flex basis-28 flex-col items-center text-center">
                <div className="mb-2 flex size-14 items-center justify-center rounded-2xl bg-yellow-500/30">
                  <PvpIcon />
                </div>
                <h3 className="mb-0.5 font-bold text-xs text-yellow-400">
                  PVP
                </h3>
              </div>
            </div>

            <div className="px-4">
              <div className="relative h-5 overflow-hidden rounded-full border border-v1-border-disabled bg-v1-surface-l2">
                <div className="relative h-full w-2/3 rounded-full bg-gradient-to-r from-v1-content-brand to-[#9eff00]" />
                <p className="absolute top-0 left-0 flex size-full items-center justify-center font-bold text-[10px] text-black/70">
                  Your Weekly Bar
                </p>
              </div>
            </div>
          </StepContent>
        ),
      },
      {
        key: '2',
        element: (
          <StepContent
            nextText="Next"
            onNext={() => setStep('3')}
            onPrev={() => setStep('1')}
            showPrev
            title={
              <>
                Speed <b className="text-v1-content-brand">Boosts</b>
              </>
            }
          >
            <div className="mb-6 flex w-full items-start justify-center gap-3">
              <div className="relative flex flex-1 flex-col items-center text-center">
                <span className="-top-2 -translate-x-1/2 absolute left-1/2 z-10 rounded bg-pink-500 px-1.5 py-0.5 font-bold text-[8px] text-white uppercase">
                  Meta
                </span>
                <div className="mb-3 flex size-14 items-center justify-center rounded-2xl bg-pink-500/20 ring-2 ring-pink-500">
                  <PartyIcon />
                </div>
                <h3 className="mb-0.5 font-bold text-pink-400 text-xs">
                  PARTY BUFF
                </h3>
                <p className="font-black text-base text-pink-400 sm:text-lg">
                  +300%
                </p>
                <p className="text-[10px] text-white/40">5 friends = 4x</p>
              </div>
              <div className="relative flex flex-1 flex-col items-center text-center">
                <div className="mb-3 flex size-14 items-center justify-center rounded-2xl bg-orange-500/20">
                  <HeatIcon />
                </div>
                <h3 className="mb-0.5 font-bold text-orange-400 text-xs">
                  HEAT BUFF
                </h3>
                <p className="font-black text-base text-orange-400 sm:text-lg">
                  +50%
                </p>
                <p className="text-[10px] text-white/40">Trade often</p>
              </div>
              <div className="relative flex flex-1 flex-col items-center text-center">
                <div className="mb-3 flex size-14 items-center justify-center rounded-2xl bg-green-500/20">
                  <DailyIcon />
                </div>
                <h3 className="mb-0.5 font-bold text-green-400 text-xs">
                  DAILY BUFF
                </h3>
                <p className="font-black text-base text-green-400 sm:text-lg">
                  +25%
                </p>
                <p className="text-[10px] text-white/40">Do missions</p>
              </div>
            </div>
            <div className="flex justify-center">
              <Badge
                className="!py-1 !text-xs !px-3"
                color="negative"
                size="md"
                variant="soft"
              >
                <Icon className="me-1" name={bxInfoCircle} size={16} />
                Trade daily to avoid decay
              </Badge>
            </div>
          </StepContent>
        ),
      },
      {
        key: '3',
        element: (
          <StepContent
            nextText="Start Trading"
            onNext={() => {
              onResolve();
            }}
            onPrev={() => setStep('2')}
            title={
              <>
                Climb to <b className="text-v1-content-brand">GOAT</b>
              </>
            }
          >
            <div className="mb-6 flex w-full items-start justify-center gap-2">
              {leagueLevels.map((lvl, idx) => (
                <HoverTooltip
                  className="relative"
                  key={lvl.name}
                  title={lvl.name}
                >
                  <img
                    alt={lvl.name}
                    className={clsx(
                      'size-10 rounded-full object-contain',
                      idx === 0 &&
                        'ring-2 ring-v1-content-brand ring-offset-1 ring-offset-black',
                    )}
                    src={lvl.icon}
                  />
                  {idx === 0 && (
                    <p className="mt-1 whitespace-nowrap text-center font-medium text-2xs text-v1-content-brand">
                      Start
                    </p>
                  )}
                </HoverTooltip>
              ))}
            </div>
            <div className="mb-4 flex items-center gap-4">
              {[
                {
                  title: 'Weekly Rewards',
                  content: (
                    <>
                      100 <SolanaIcon size="sm" />
                    </>
                  ),
                },
                { title: 'Max Cacheback', content: <>100%</> },
              ].map(item => (
                <div
                  className="shrink-0 grow basis-1 rounded-lg border border-v1-border-disabled/50 bg-v1-surface-l2/50 p-3 text-center"
                  key={item.title}
                >
                  <p className="mb-2 text-[9px] text-v1-content-secondary uppercase">
                    {item.title}
                  </p>
                  <div className="flex items-center justify-center font-black text-2xl text-v1-content-brand">
                    {item.content}
                  </div>
                </div>
              ))}
            </div>
            <p className="mb-2 text-center text-2xs text-v1-content-secondary">
              Promotions on Wednesdays
            </p>
          </StepContent>
        ),
      },
    ],
    [onResolve, leagueLevels.map],
  );

  return (
    <OnboardingView
      className="w-"
      fullscreen={false}
      onChange={setStep}
      step={step}
      steps={steps}
    />
  );
}
