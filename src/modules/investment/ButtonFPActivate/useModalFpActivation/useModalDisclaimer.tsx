import { useTranslation } from 'react-i18next';
import useConfirm from 'shared/useConfirm';

const useModalDisclaimer = () => {
  const { t } = useTranslation('products');
  return useConfirm({
    yesTitle: 'Accept',
    noTitle: 'Cancel',
    icon: null,
    message: (
      <div className="">
        <h1 className="mb-6 text-center text-[#F1AA40]">
          {t('disclaimer.title')}
        </h1>
        <div className="h-[14rem] overflow-auto text-white">
          <p className="mb-2">{t('disclaimer.description')}</p>

          <ul className="mb-2 list-inside list-disc pl-2">
            <li>{t('disclaimer.risk-1')}</li>
            <li>{t('disclaimer.risk-2')}</li>
            <li>{t('disclaimer.risk-3')}</li>
          </ul>

          <p>{t('disclaimer.warn')}</p>
        </div>
      </div>
    ),
  });
};

export default useModalDisclaimer;
