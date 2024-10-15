import { type Dispatch, type SetStateAction } from 'react';
import type React from 'react';

export type OnboardingMessageSections = Array<{
  title: React.ReactNode;
  content: React.ReactNode;
  video?: string;
}>;

export interface OnboardingMessageEvents {
  onIntract?: (
    segmentKey:
      | 'gotit'
      | `next_in_step${number}`
      | `back_in_step${number}`
      | `close_in_step${number}`,
  ) => void;
}

export interface OnboardingMessageContextInterface {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  openMessage: () => void;
  closeMessage: () => void;
  sections: OnboardingMessageSections | null;
  setSections: (sections: OnboardingMessageSections | null) => void;
  events: OnboardingMessageEvents;
  setEvents: Dispatch<SetStateAction<OnboardingMessageEvents>>;
}
