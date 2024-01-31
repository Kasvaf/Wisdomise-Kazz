import { useTranslation } from 'react-i18next';
import Button from 'modules/shared/Button';
import useConfirm from 'shared/useConfirm';
import { useIsVerified } from 'api';
import Spin from 'modules/shared/Spin';

const useModalActivationNotice = () => {
  const { t } = useTranslation('products');
  const isVerified = useIsVerified();
  return useConfirm({
    yesTitle: '',
    noTitle: '',
    icon: null,
    message: (
      <div className="">
        <h1 className="mb-6 text-center text-[#F1AA40]">
          {t('notification-activated.title')}
        </h1>
        <div className="h-auto text-white">
          <p className="mb-2">{t('notification-activated.message')}</p>

          {isVerified.isLoading ? (
            <div className="my-6 flex justify-center">
              <Spin />
            </div>
          ) : (
            !isVerified.isAllVerified && (
              <p className="mb-2">{t('notification-activated.kyc-notice')}</p>
            )
          )}
        </div>

        <div className="mt-8 flex justify-end">
          <Button size="small" variant="primary" to="/investment/assets">
            {t('notification-activated.btn-dashboard')}
          </Button>
        </div>
      </div>
    ),
  });
};

export default useModalActivationNotice;
