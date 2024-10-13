import { useMemo, useState } from 'react';
import {
  type Alert,
  type AlertDataSource,
  useDeleteAlert,
  useSaveAlert,
} from 'api/alert';
import { track } from 'config/segment';
import useEnsureAuthenticated from 'shared/useEnsureAuthenticated';
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
  const alertSavePostActions = (alertItem: Partial<Alert<never>>) => {
    if (alertItem.dataSource === 'custom:coin_radar_notification') {
      track('Click On', {
        place: 'social_radar_notification_changed',
        status: alertItem.messengers?.includes('EMAIL') ? 'on' : 'off',
      });
    }
  };

  const [ModalLogin, ensureAuthenticated] = useEnsureAuthenticated();
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
                .then(() => alertSavePostActions(payload))
                .then(() => showSaveToast())
            }
          />
          {ModalLogin}
          {deleteConfirmModal}
          {saveToast}
        </>
      ),
      openSaveModal: async () =>
        (await ensureAuthenticated()) && setIsModalOpen(true),
      save: async () => {
        if (!initialAlert) {
          throw new Error(
            'You must set initial alert in order to save without modal!',
          );
        }
        if (!(await ensureAuthenticated())) return false;
        return await saveAlertMutation
          .mutateAsync(initialAlert)
          .then(() => setIsModalOpen(false))
          .then(() => alertSavePostActions(initialAlert))
          .then(() => showSaveToast());
      },
      delete: () =>
        showDeleteConfirm().then(confirmed => {
          if (!confirmed) return;
          return deleteAlertMutation.mutateAsync();
        }),
      isDeleting: deleteAlertMutation.isLoading,
      isSaving: saveAlertMutation.isLoading,
    }),
    [
      ModalLogin,
      deleteAlertMutation,
      deleteConfirmModal,
      ensureAuthenticated,
      initialAlert,
      isModalOpen,
      saveAlertMutation,
      saveToast,
      showDeleteConfirm,
      showSaveToast,
    ],
  );
};
