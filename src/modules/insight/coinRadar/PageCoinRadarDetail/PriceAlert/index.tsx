import { clsx } from 'clsx';
import { type FC, useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { bxBell } from 'boxicons-quasar';
import { isAxiosError } from 'axios';
import Button from 'shared/Button';
import Icon from 'shared/Icon';
import {
  AlertSaveModal,
  useAlertSaveToast,
} from 'modules/account/PageNotification/AlertsTab/AlertSaveModal';
import { type Alert, useAlerts, useSaveAlert } from 'api/alert';
import { useHasFlag } from 'api';
import { unwrapErrorMessage } from 'utils/error';

export const PriceAlertButton: FC<{
  className?: string;
  symbol: string;
}> = ({ className, symbol }) => {
  const { t } = useTranslation('coin-radar');
  const hasFlag = useHasFlag();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [successModal, showSuccessModal] = useAlertSaveToast();

  const possibleRelatedAlerts = useAlerts('market_data', {
    base: symbol,
  });
  const initialAlert = useMemo(() => {
    return (possibleRelatedAlerts.data?.at(-1) || {
      dataSource: 'market_data',
      params: {
        base: symbol,
      },
    }) as Partial<Alert<'market_data'>>;
  }, [possibleRelatedAlerts.data, symbol]);

  const alertMutation = useSaveAlert(initialAlert.key);

  if (!hasFlag('/account/notification-center?tab=alerts')) return null;

  return (
    <>
      <Button
        onClick={() => setIsModalOpen(true)}
        variant={initialAlert.key ? 'alternative' : 'primary'}
        className={clsx('h-10 w-auto !py-1 mobile:!px-4', className)}
        contentClassName="flex gap-0"
      >
        <Icon size={20} name={bxBell} className="mr-1" />
        {initialAlert.key
          ? t('set-price-notification.open-existing-modal-btn')
          : t('set-price-notification.open-modal-btn')}
      </Button>
      <AlertSaveModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        alert={initialAlert}
        onSubmit={dto =>
          alertMutation
            .mutateAsync(dto)
            .then(() => {
              setIsModalOpen(false);
              return showSuccessModal();
            })
            .catch(error => {
              if (isAxiosError(error)) {
                alert(unwrapErrorMessage(error));
              }
              throw error;
            })
        }
        loading={alertMutation.isLoading || possibleRelatedAlerts.isLoading}
        assetLock
        showLink
      />
      {successModal}
    </>
  );
};
