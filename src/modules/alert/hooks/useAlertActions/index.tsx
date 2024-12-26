import { useMemo, useState } from 'react';
import { type Alert } from 'api/alert';
import { AlertModal } from 'modules/alert/library/AlertModal';
import { AlertProvider } from 'modules/alert/library/AlertProvider';
import { AlertEdit } from 'modules/alert/library/AlertEdit';
import { useAlertForm, useAlertForms } from 'modules/alert/forms';
import { useSubscription } from 'api';
import {
  useAlertDeleteConfirm,
  useAlertSaveToast,
} from './useAlertConfirmModal';

export const useAlertActions = (
  initialAlert: Partial<Alert>,
  lock?: boolean,
) => {
  const initialAlertForm = useAlertForm(initialAlert);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteConfirmModal, showDeleteConfirm] = useAlertDeleteConfirm();
  const [saveToast, showSaveToast] = useAlertSaveToast();
  const forms = useAlertForms();
  const { ensureGroup, loginModal } = useSubscription();

  return useMemo(
    () => ({
      content: (
        <>
          <AlertModal open={isModalOpen} onClose={() => setIsModalOpen(false)}>
            <AlertProvider initialValue={initialAlert} forms={forms}>
              <AlertEdit
                onClose={() => setIsModalOpen(false)}
                lock={lock}
                onFinish={() => {
                  setIsModalOpen(false);
                  void showSaveToast();
                }}
              />
            </AlertProvider>
          </AlertModal>
          <div className="hidden">
            {deleteConfirmModal}
            {saveToast}
            {loginModal}
          </div>
        </>
      ),
      openSaveModal: async () =>
        (await ensureGroup(['pro', 'pro+', 'trial'])) && setIsModalOpen(true),
      save: async (showToast?: boolean) => {
        if (!initialAlert) throw new Error('No initial alert found!');
        if (!initialAlertForm) throw new Error('No compatible type found!');
        if (!(await ensureGroup(['pro', 'pro+', 'trial']))) return false;
        const saveFn = initialAlertForm.save;
        if (!saveFn) throw new Error(`${initialAlertForm.value} has'nt save!`);
        setIsSaving(true);
        return await saveFn(initialAlert)
          .then(() => setIsModalOpen(false))
          .then(() => showToast !== false && showSaveToast())
          .finally(() => setIsSaving(false));
      },
      delete: async () => {
        if (!initialAlert) throw new Error('No initial alert found!');
        if (!initialAlertForm) throw new Error('No compatible type found!');
        if (!(await ensureGroup(['pro', 'pro+', 'trial']))) return false;
        const delFn = initialAlertForm.delete;
        if (!delFn) throw new Error(`${initialAlertForm.value} has'nt delete!`);
        setIsDeleting(true);
        return await showDeleteConfirm()
          .then(confirmed => {
            if (!confirmed) return;
            return delFn(initialAlert);
          })
          .finally(() => setIsDeleting(false));
      },
      isDeleting,
      isSaving,
    }),
    [
      isModalOpen,
      initialAlert,
      forms,
      lock,
      deleteConfirmModal,
      saveToast,
      loginModal,
      isDeleting,
      isSaving,
      showSaveToast,
      ensureGroup,
      initialAlertForm,
      showDeleteConfirm,
    ],
  );
};
