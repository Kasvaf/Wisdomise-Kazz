import { useTranslation } from 'react-i18next';
import { bxCheckCircle } from 'boxicons-quasar';
import useConfirm from 'shared/useConfirm';
import Icon from 'shared/Icon';
import deleteConfirmICon from './delete-confirm.png';

export const useAlertDeleteConfirm = () => {
  const { t } = useTranslation('notifications');
  return useConfirm({
    icon: <img src={deleteConfirmICon} />,
    yesTitle: t('alerts.form.delete-confirm.yes'),
    noTitle: t('alerts.form.delete-confirm.no'),
    message: (
      <>
        <h2 className="-mt-12 text-center text-lg">
          {t('alerts.form.delete-confirm.title')}
        </h2>
        <p className="text-center opacity-90">
          {t('alerts.form.delete-confirm.subtitle')}
        </p>
      </>
    ),
  });
};

export const useAlertSaveToast = () => {
  const { t } = useTranslation('notifications');
  return useConfirm({
    icon: <Icon name={bxCheckCircle} className="text-success" size={52} />,
    yesTitle: t('common:actions.ok'),
    message: (
      <p className="text-center text-base">
        {t('alerts.form.success-message')}
      </p>
    ),
  });
};
