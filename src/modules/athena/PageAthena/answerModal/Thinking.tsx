import { useTranslation } from 'react-i18next';

export const ThinkingLoading = () => {
  const { t } = useTranslation('athena');
  return (
    <div className="thinking">
      {t('thinking')} <span></span>
    </div>
  );
};
