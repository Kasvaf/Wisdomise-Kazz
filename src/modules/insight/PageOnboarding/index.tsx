import { type ComponentProps, useCallback, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserStorage } from 'api/userStorage';
import { OnboardingView } from './components/OnboardingView';
import { ApproachStep } from './components/steps/ApproachStep';
import { ExperienceStep } from './components/steps/ExperienceStep';
import { FeaturesStep } from './components/steps/FeaturesStep';
import { ReadyStep } from './components/steps/ReadyStep';

export default function PageOnboarding() {
  const [step, setStep] = useState('experience');
  const navigate = useNavigate();

  const { save, isLoading } = useUserStorage('onboarding-data');
  const [data, setData] = useState<{
    experience: undefined | string;
    approach: string[];
  }>({
    experience: undefined,
    approach: [],
  });

  const done = useCallback(
    async (url?: string) => {
      await save(JSON.stringify(data));
      navigate(url ?? '/coin-radar/overview');
    },
    [data, navigate, save],
  );

  const steps = useMemo<ComponentProps<typeof OnboardingView>['steps']>(
    () => [
      {
        key: 'experience',
        label: 'Experience & Goals',
        element: (
          <ExperienceStep
            onNext={newValue => {
              setData(p => ({
                ...p,
                experience: newValue,
              }));
              setStep('approach');
            }}
            value={data.experience}
          />
        ),
      },
      {
        key: 'approach',
        label: 'Trading Approach',
        element: (
          <ApproachStep
            value={data.approach}
            onPrev={() => setStep('experience')}
            onNext={newValue => {
              setData(p => ({
                ...p,
                approach: newValue,
              }));
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
            onPrev={() => setStep('approach')}
            onNext={() => setStep('ready')}
          />
        ),
      },
      {
        key: 'ready',
        label: 'Start Your Journey',
        element: (
          <ReadyStep
            value={data.approach}
            onPrev={() => setStep('features')}
            onNext={done}
          />
        ),
      },
    ],
    [data.approach, data.experience, done],
  );

  return (
    <OnboardingView
      steps={steps}
      step={step}
      onChange={setStep}
      loading={isLoading}
    />
  );
}
