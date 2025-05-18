import { useTour, type StepType } from '@reactour/tour';
import { useLocalStorage } from 'usehooks-ts';
import { useEffect } from 'react';

const usePageTour = ({
  enabled,
  steps,
  key,
}: {
  enabled?: boolean;
  steps: StepType[];
  key: string;
}) => {
  const [seen, setSeen] = useLocalStorage('seen-' + key, false);
  const { setCurrentStep, setSteps, setIsOpen } = useTour();

  useEffect(() => {
    if (!enabled || seen) return;
    setTimeout(() => {
      setSeen(true);
      setSteps?.(steps);
      setCurrentStep(0);
      setIsOpen(true);
    }, 500);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, seen, steps]);
};

export default usePageTour;
