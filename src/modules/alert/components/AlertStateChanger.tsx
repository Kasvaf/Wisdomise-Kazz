import { useSaveAlert, type Alert } from 'api';
import { Toggle } from 'shared/Toggle';

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
      checked={value.state !== 'DISABLED'}
      className={className}
      loading={alertSaveMutation.isPending}
    />
  );
}
