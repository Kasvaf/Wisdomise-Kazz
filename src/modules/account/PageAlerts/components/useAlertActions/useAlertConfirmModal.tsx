import { useTranslation } from 'react-i18next';
import { bxCheckCircle } from 'boxicons-quasar';
import useConfirm from 'shared/useConfirm';
import Icon from 'shared/Icon';
import deleteConfirmICon from './delete-confirm.png';

export const useAlertDeleteConfirm = () => {
  const { t } = useTranslation('alerts');
  return useConfirm({
    icon: <img src={deleteConfirmICon} />,
    yesTitle: t('forms.delete-confirm.yes'),
    noTitle: t('forms.delete-confirm.no'),
    message: (
      <>
        <h2 className="-mt-12 text-center text-lg">
          {t('forms.delete-confirm.title')}
        </h2>
        <p className="text-center opacity-90">
          {t('forms.delete-confirm.subtitle')}
        </p>
      </>
    ),
  });
};

export const useAlertSaveToast = () => {
  const { t } = useTranslation('alerts');
  return useConfirm({
    icon: <Icon name={bxCheckCircle} className="text-success" size={52} />,
    yesTitle: t('common:actions.ok'),
    message: (
      <p className="text-center text-base">{t('common.success-message')}</p>
    ),
  });
};
