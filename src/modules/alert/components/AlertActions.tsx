import type { Alert } from 'api/alert';
import { bxEdit, bxTrash } from 'boxicons-quasar';
import { clsx } from 'clsx';
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
        className={clsx(alertActions.isSaving && 'animate-pulse')}
        disabled={alertActions.isSaving}
        onClick={alertActions.openSaveModal}
      >
        <Icon name={bxEdit} />
      </button>
      <button
        className={clsx(alertActions.isDeleting && 'animate-pulse')}
        disabled={alertActions.isDeleting}
        onClick={alertActions.delete}
      >
        <Icon name={bxTrash} />
      </button>
      {alertActions.content}
    </div>
  );
}
