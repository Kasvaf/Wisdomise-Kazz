import { type PropsWithChildren, useState, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import OnboardingMessageNotification from './OnboardingMessageNotification';
import {
  type OnboardingMessageEvents,
  type OnboardingMessageSections,
} from './types';
import { OnboardingMessageContext } from './utils';

export default function OnboardingMessageProvider({
  children,
}: PropsWithChildren) {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [sections, _setSections] = useState<OnboardingMessageSections | null>(
    null,
  );
  const [events, setEvents] = useState<OnboardingMessageEvents>({});

  const closeMessage = useCallback(() => {
    setIsOpen(false);
    setClosedMessages([...getClosedMessages(), location.pathname]);
  }, [location.pathname]);

  const openMessage = useCallback(() => {
    setIsOpen(true);
    setClosedMessages(getClosedMessages().filter(r => r !== location.pathname));
  }, [location.pathname]);

  const setSections = useCallback(
    (sections: OnboardingMessageSections | null) => {
      _setSections(sections);
      if (sections && !getClosedMessages().includes(location.pathname)) {
        openMessage();
      }
    },
    [location.pathname, openMessage],
  );

  return (
    <OnboardingMessageContext.Provider
      value={{
        events,
        setEvents,
        sections,
        setSections,
        isOpen,
        closeMessage,
        openMessage,
        setIsOpen,
      }}
    >
      {children}
      {isOpen && <OnboardingMessageNotification />}
    </OnboardingMessageContext.Provider>
  );
}

const getClosedMessages = () =>
  JSON.parse(localStorage.getItem('closed-onboarding') || '[]') as string[];

const setClosedMessages = (closedMessages: string[]) =>
  localStorage.setItem('closed-onboarding', JSON.stringify(closedMessages));
