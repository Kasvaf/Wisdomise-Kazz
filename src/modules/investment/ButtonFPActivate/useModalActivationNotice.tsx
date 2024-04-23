import { useTranslation } from 'react-i18next';
import { trackClick } from 'config/segment';
import useConfirm from 'shared/useConfirm';
import Button from 'shared/Button';

const useModalActivationNotice = () => {
  const { t } = useTranslation('products');

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
        </div>

        <div className="-mx-3 mt-8 flex justify-center">
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
