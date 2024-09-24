import { useMemo, useState } from 'react';
import {
  type Alert,
  type AlertDataSource,
  useDeleteAlert,
  useSaveAlert,
} from 'api/alert';
import { AlertSaveModal } from '../AlertSaveModal';
import {
  useAlertDeleteConfirm,
  useAlertSaveToast,
} from './useAlertConfirmModal';

export const useAlertActions = <D extends AlertDataSource>(
  initialAlert?: Partial<Alert<D>>,
) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const saveAlertMutation = useSaveAlert(initialAlert?.key);
  const deleteAlertMutation = useDeleteAlert(
    initialAlert as Partial<Alert<never>>,
  );
  const [deleteConfirmModal, showDeleteConfirm] = useAlertDeleteConfirm();
  const [saveToast, showSaveToast] = useAlertSaveToast();

  return useMemo(
    () => ({
      content: (
        <>
          <AlertSaveModal
            value={initialAlert}
            lock={
              initialAlert?.dataSource === 'market_data' &&
              !!initialAlert.params?.base
            }
            isOpen={isModalOpen}
            loading={saveAlertMutation.isLoading}
            onClose={() => setIsModalOpen(false)}
            onSubmit={payload =>
              saveAlertMutation
                .mutateAsync(payload)
                .then(() => setIsModalOpen(false))
                .then(() => showSaveToast())
            }
          />
          {deleteConfirmModal}
          {saveToast}
        </>
      ),
      openSaveModal: () => setIsModalOpen(true),
      delete: () =>
        showDeleteConfirm().then(confirmed => {
          if (!confirmed) return;
          return deleteAlertMutation.mutateAsync();
        }),
      isDeleting: deleteAlertMutation.isLoading,
      isSaving: saveAlertMutation.isLoading,
    }),
    [
      deleteAlertMutation,
      deleteConfirmModal,
      initialAlert,
      isModalOpen,
      saveAlertMutation,
      saveToast,
      showDeleteConfirm,
      showSaveToast,
    ],
  );
};
