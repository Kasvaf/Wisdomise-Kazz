import {
  createContext,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
  useContext,
  useMemo,
  useState,
} from 'react';
import type { Alert } from 'services/rest/alert';
import type { AlertForm, AlertFormGroup } from './types';

export type EditingAlertState = [
  Partial<Alert>,
  Dispatch<SetStateAction<Partial<Alert>>>,
];

const editingAlert = createContext<{
  value: EditingAlertState;
  forms: Array<AlertForm | AlertFormGroup>;
}>({
  value: [] as never,
  forms: [],
});

export const useEditingAlert = () => useContext(editingAlert);

export function AlertProvider({
  children,
  initialValue,
  forms,
}: {
  children: ReactNode;
  initialValue?: Partial<Alert>;
  forms: Array<AlertForm | AlertFormGroup>;
}) {
  const value = useState(initialValue ?? {});

  // biome-ignore lint/correctness/useExhaustiveDependencies: <reason>
  const providingValue = useMemo(() => {
    return {
      value,
      forms,
    };
  }, [JSON.stringify(value[0]), forms]);

  return (
    <editingAlert.Provider value={providingValue as never}>
      {children}
    </editingAlert.Provider>
  );
}
