import { useTour, type StepType } from '@reactour/tour';
import { useLocalStorage } from 'usehooks-ts';
import { useEffect } from 'react';

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
  const [seen, setSeen] = useLocalStorage('seen-' + key, false);
  const { setCurrentStep, setSteps, setIsOpen } = useTour();

  useEffect(() => {
    if (!enabled || seen) return;
    const timer = setTimeout(() => {
      setSeen(true);
      setSteps?.(steps);
      setCurrentStep(0);
      setIsOpen(true);
    }, delay);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, seen, steps]);
};

export default usePageTour;
