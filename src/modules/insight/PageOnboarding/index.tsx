import { type ComponentProps, useMemo, useState } from 'react';
import { clsx } from 'clsx';
import { useUserStorage } from 'api/userStorage';
import { OnboardingView } from './components/OnboardingView';
import { ApprochStep } from './components/steps/ApprochStep';
import { ExperienceStep } from './components/steps/ExperienceStep';
import { FeaturesStep } from './components/steps/FeaturesStep';
import { ReadyStep } from './components/steps/ReadyStep';
import { useOnboarding } from './hooks/useOnboarding';

export default function PageOnboarding() {
  const { done, isLoading } = useOnboarding();
  const [step, setStep] = useState('experience');
  const { value: experience, save: setExperience } =
    useUserStorage('experience');
  const { value: approch, save: setApproch } = useUserStorage('approch');
  const steps = useMemo<ComponentProps<typeof OnboardingView>['steps']>(
    () => [
      {
        key: 'experience',
        label: 'Experience & Goals',
        element: (
          <ExperienceStep
            onNext={newValue => {
              void setExperience(newValue);
              setStep('approch');
            }}
            value={experience ?? undefined}
          />
        ),
      },
      {
        key: 'approch',
        label: 'Trading Approach',
        element: (
          <ApprochStep
            value={approch ? JSON.parse(approch) : []}
            onPrev={() => setStep('experience')}
            onNext={newValue => {
              void setApproch(JSON.stringify(newValue));
              setStep('features');
            }}
          />
        ),
      },
      {
        key: 'features',
        label: 'Features',
        element: (
          <FeaturesStep
            onPrev={() => setStep('approch')}
            onNext={() => setStep('ready')}
          />
        ),
      },
      {
        key: 'ready',
        label: 'Start Your Journey',
        element: (
          <ReadyStep
            value={approch ? JSON.parse(approch) : []}
            onPrev={() => setStep('features')}
            onNext={() => done()}
          />
        ),
      },
    ],
    [approch, done, experience, setApproch, setExperience],
  );

  return (
    <OnboardingView
      onClose={done}
      steps={steps}
      step={step}
      className={clsx(isLoading && 'pointer-events-none animate-pulse')}
    />
  );
}
