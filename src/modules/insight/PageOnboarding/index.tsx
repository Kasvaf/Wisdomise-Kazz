import { type ComponentProps, useCallback, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserStorage } from 'api/userStorage';
import { OnboardingView } from './components/OnboardingView';
import { ApprochStep } from './components/steps/ApprochStep';
import { ExperienceStep } from './components/steps/ExperienceStep';
import { FeaturesStep } from './components/steps/FeaturesStep';
import { ReadyStep } from './components/steps/ReadyStep';

export default function PageOnboarding() {
  const [step, setStep] = useState('experience');
  const navigate = useNavigate();

  const { save } = useUserStorage('onboarding-data');
  const [data, setData] = useState<{
    experience: undefined | string;
    approch: string[];
  }>({
    experience: undefined,
    approch: [],
  });

  const done = useCallback(
    (url?: string) => {
      void save(JSON.stringify(data));
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
              setStep('approch');
            }}
            value={data.experience}
          />
        ),
      },
      {
        key: 'approch',
        label: 'Trading Approach',
        element: (
          <ApprochStep
            value={data.approch}
            onPrev={() => setStep('experience')}
            onNext={newValue => {
              setData(p => ({
                ...p,
                approch: newValue,
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
            value={data.approch}
            onPrev={() => setStep('features')}
            onNext={done}
          />
        ),
      },
    ],
    [data.approch, data.experience, done],
  );

  return (
    <OnboardingView
      onClose={done}
      steps={steps}
      step={step}
      onChange={setStep}
    />
  );
}
