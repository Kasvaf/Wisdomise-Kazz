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
import { type AlertForm, type AlertFormGroup } from './types';

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

  const providingValue = useMemo(() => {
    return {
      value,
      forms,
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(value[0]), forms]);

  return (
    <editingAlert.Provider value={providingValue as never}>
      {children}
    </editingAlert.Provider>
  );
}
