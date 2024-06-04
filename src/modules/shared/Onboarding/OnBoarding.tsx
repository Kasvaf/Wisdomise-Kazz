import { useEffect } from 'react';
import { useOnboardingMessage } from './utils';
import {
  type OnboardingMessageEvents,
  type OnboardingMessageSections,
} from './types';

interface Props {
  sections: OnboardingMessageSections;
  onIntract?: OnboardingMessageEvents['onIntract'];
}
export function Onboarding({ sections, onIntract }: Props) {
  const { setSections, setIsOpen, setEvents } = useOnboardingMessage();

  useEffect(() => {
    setSections(sections);
    setEvents({
      onIntract,
    });
    return () => {
      setSections(null);
      setEvents({});
      setIsOpen(false);
    };
  }, [sections, setIsOpen, setSections, setEvents, onIntract]);

  return null;
}
