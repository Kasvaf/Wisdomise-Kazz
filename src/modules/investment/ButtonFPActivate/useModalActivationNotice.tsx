import { useTranslation } from 'react-i18next';
import { clsx } from 'clsx';
import { useIsVerified } from 'api';
import { trackClick } from 'config/segment';
import useConfirm from 'shared/useConfirm';
import Button from 'shared/Button';
import Spin from 'shared/Spin';

const useModalActivationNotice = () => {
  const { t } = useTranslation('products');
  const isVerified = useIsVerified();
  const showKycButton = isVerified.isLoading || !isVerified.isAllVerified;

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

        <div
          className={clsx(
            '-mx-3 mt-8 flex',
            showKycButton ? 'justify-stretch' : 'justify-center',
          )}
        >
          {showKycButton && (
            <Button
              size="small"
              variant="alternative"
              to="/account/kyc"
              className="mx-3 basis-1/2"
              loading={isVerified.isLoading}
              onClick={trackClick('activated_goto_kyc')}
            >
              {t('notification-activated.btn-kyc')}
            </Button>
          )}

          <Button
            size="small"
            variant="primary"
            to="/investment/assets"
            className="mx-3 basis-1/2"
            onClick={trackClick('activated_goto_dashboard')}
          >
            {t('notification-activated.btn-dashboard')}
          </Button>
        </div>
      </div>
    ),
  });
};

export default useModalActivationNotice;
