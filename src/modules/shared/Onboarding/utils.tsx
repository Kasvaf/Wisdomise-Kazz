import { createContext, useContext } from 'react';
import { type OnboardingMessageContextInterface } from './types';

export const OnboardingMessageContext =
  createContext<OnboardingMessageContextInterface | null>(null);

export const useOnboardingMessage = () => {
  const ctx = useContext(OnboardingMessageContext);
  if (!ctx) {
    throw new Error(
      'No OnboardingMessagesContext.Provider found in component tree',
    );
  }
  return ctx;
};
