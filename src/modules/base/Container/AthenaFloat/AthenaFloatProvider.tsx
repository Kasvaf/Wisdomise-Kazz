import { type PropsWithChildren, createContext, useContext } from 'react';
import { useToggle } from 'usehooks-ts';

export function AthenaFloatProvider({ children }: PropsWithChildren) {
  const [isOpen, toggleOpen] = useToggle();

  return (
    <AthenaFloatContext.Provider value={{ isOpen, toggleOpen }}>
      {children}
    </AthenaFloatContext.Provider>
  );
}

export interface AthenaFloatContextInterface {
  isOpen: boolean;
  toggleOpen: VoidFunction;
}
const AthenaFloatContext = createContext<AthenaFloatContextInterface | null>(
  null,
);

export const useAthenaFloat = () => {
  const ctx = useContext(AthenaFloatContext);
  if (!ctx) {
    throw new Error('Athen float provider not found');
  }
  return ctx;
};
