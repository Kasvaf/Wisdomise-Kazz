import { type Dispatch, type SetStateAction } from 'react';
import type React from 'react';

export type OnboardingMessageSections = Array<{
  title: string;
  content: React.ReactNode;
}>;

export interface OnboardingMessageContextInterface {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  openMessage: () => void;
  closeMessage: () => void;
  sections: OnboardingMessageSections | null;
  setSections: (sections: OnboardingMessageSections | null) => void;
}
