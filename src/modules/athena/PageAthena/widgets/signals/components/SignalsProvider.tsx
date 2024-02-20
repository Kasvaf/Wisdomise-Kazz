import { type PropsWithChildren } from 'react';
import type React from 'react';
import { createContext, useContext } from 'react';

export type Props = SignalsContext;

export const SignalsProvider: React.FC<PropsWithChildren<Props>> = ({
  children,
  ...props
}) => {
  return <context.Provider value={props}>{children}</context.Provider>;
};

export interface SignalsContext {
  telegramId?: string;
  userPlanLevel: number;
  onBellClick?: () => void;
  onUpgradeClick?: () => void;
}

const context = createContext<SignalsContext | null>(null);

export const useSignals = () => {
  const ctx = useContext(context);
  if (!ctx) {
    throw new Error('Signal Context not found');
  }
  return ctx;
};
