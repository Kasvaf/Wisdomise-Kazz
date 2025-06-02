import { useSaveAlert, type Alert } from 'api';
import { Toggle } from 'shared/v1-components/Toggle';

export function AlertStateChanger({
  value,
  className,
}: {
  value: Alert;
  className?: string;
}) {
  const alertSaveMutation = useSaveAlert(value.key);
  return (
    <Toggle
      onChange={newValue => {
        const newState = newValue ? 'ACTIVE' : 'DISABLED';
        return alertSaveMutation.mutateAsync({
          ...value,
          state: newState,
        });
      }}
      trueLabel="Active"
      falseLabel="Deactive"
      value={value.state !== 'DISABLED'}
      className={className}
      loading={alertSaveMutation.isPending}
    />
  );
}
