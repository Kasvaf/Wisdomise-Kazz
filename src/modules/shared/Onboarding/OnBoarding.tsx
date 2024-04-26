import { useEffect } from 'react';
import { useOnboardingMessage } from './utils';
import { type OnboardingMessageSections } from './types';

interface Props {
  sections: OnboardingMessageSections;
}
export function Onboarding({ sections }: Props) {
  const { setSections, setIsOpen } = useOnboardingMessage();

  useEffect(() => {
    setSections(sections);
    return () => {
      setSections(null);
      setIsOpen(false);
    };
  }, [sections, setIsOpen, setSections]);

  return null;
}
