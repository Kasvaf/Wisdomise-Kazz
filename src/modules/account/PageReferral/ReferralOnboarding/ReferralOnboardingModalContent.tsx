import { type ComponentProps, useCallback, useMemo, useState } from 'react';
import { useLocalStorage } from 'usehooks-ts';
import { OnboardingView } from 'modules/insight/PageOnboarding/components/OnboardingView';
import WelcomeStep from 'modules/account/PageReferral/ReferralOnboarding/WelcomeStep';
import HowStep from 'modules/account/PageReferral/ReferralOnboarding/HowStep';

export default function ReferralOnboardingModalContent({
  onResolve,
}: {
  onResolve: () => void;
}) {
  const [step, setStep] = useState('welcome');
  const [, setDone] = useLocalStorage('referral-onboarding', false);

  const done = useCallback(() => {
    setDone(true);
    onResolve();
  }, [onResolve, setDone]);

  const steps = useMemo<ComponentProps<typeof OnboardingView>['steps']>(
    () => [
      {
        key: 'welcome',
        element: <WelcomeStep onNext={() => setStep('how')} />,
      },
      {
        key: 'how',
        element: <HowStep onNext={done} onPrev={() => setStep('welcome')} />,
      },
    ],
    [done],
  );

  return <OnboardingView steps={steps} step={step} onChange={setStep} />;
}
