import { useTranslation } from 'react-i18next';

const useQualityLocales = () => {
  const { t } = useTranslation('common');
  const label = {
    'Low': t('quality.low'),
    'Medium': t('quality.medium'),
    'High': t('quality.high'),
    '': '',
  };

  return (key: keyof typeof label) => label[key] || key;
};

export default useQualityLocales;
