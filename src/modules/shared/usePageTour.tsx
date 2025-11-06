import { type StepType, useTour } from '@reactour/tour';
import { useEffect } from 'react';
import { useLocalStorage } from 'usehooks-ts';

const usePageTour = ({
  enabled,
  steps,
  key,
  delay = 500,
}: {
  enabled?: boolean;
  steps: StepType[];
  key: string;
  delay?: number;
}) => {
  enabled = false;
  const [seen, setSeen] = useLocalStorage(`seen-${key}`, false);
  const { setCurrentStep, setSteps, setIsOpen } = useTour();

  // biome-ignore lint/correctness/useExhaustiveDependencies: <reason>
  useEffect(() => {
    if (!enabled || seen) return;
    const timer = setTimeout(() => {
      setSeen(true);
      setSteps?.(steps);
      setCurrentStep(0);
      setIsOpen(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [enabled, seen, steps]);
};

export default usePageTour;
