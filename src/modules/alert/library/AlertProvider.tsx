import {
  createContext,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
  useContext,
  useMemo,
  useState,
} from 'react';
import { type Alert } from 'api/alert';

export type EditingAlertState = [
  Partial<Alert>,
  Dispatch<SetStateAction<Partial<Alert>>>,
];

const editingAlert = createContext<EditingAlertState | null>(null);

export function useEditingAlert() {
  const editingAlertObject = useContext(editingAlert);
  return editingAlertObject as EditingAlertState;
}

export function AlertProvider({
  children,
  initialValue,
}: {
  children: ReactNode;
  initialValue?: Partial<Alert>;
}) {
  const value = useState(initialValue ?? {});

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const providingValue = useMemo(() => value, [JSON.stringify(value[0])]);

  return (
    <editingAlert.Provider value={providingValue as never}>
      {children}
    </editingAlert.Provider>
  );
}
