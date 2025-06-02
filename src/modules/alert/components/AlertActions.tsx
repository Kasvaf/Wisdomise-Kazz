import { bxEdit, bxTrash } from 'boxicons-quasar';
import { clsx } from 'clsx';
import { type Alert } from 'api/alert';
import Icon from 'shared/Icon';
import { useAlertActions } from '../hooks/useAlertActions';

export function AlertActions({
  value,
  className,
}: {
  value: Alert;
  className?: string;
}) {
  const alertActions = useAlertActions(value, true);
  return (
    <div className={clsx('inline-flex items-center gap-2', className)}>
      <button
        onClick={alertActions.openSaveModal}
        disabled={alertActions.isSaving}
        className={clsx(alertActions.isSaving && 'animate-pulse')}
      >
        <Icon name={bxEdit} />
      </button>
      <button
        onClick={alertActions.delete}
        disabled={alertActions.isDeleting}
        className={clsx(alertActions.isDeleting && 'animate-pulse')}
      >
        <Icon name={bxTrash} />
      </button>
      {alertActions.content}
    </div>
  );
}
