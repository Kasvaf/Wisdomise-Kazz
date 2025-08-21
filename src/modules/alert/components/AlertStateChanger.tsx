import { type Alert, useSaveAlert } from 'api/alert';
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
      className={className}
      falseLabel="Deactive"
      loading={alertSaveMutation.isPending}
      onChange={newValue => {
        const newState = newValue ? 'ACTIVE' : 'DISABLED';
        return alertSaveMutation.mutateAsync({
          ...value,
          state: newState,
        });
      }}
      trueLabel="Active"
      value={value.state !== 'DISABLED'}
    />
  );
}
