import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

export const useModalLoginTexts = () => {
  // const { pathname } = useLocation();
  const { t } = useTranslation('auth');

  return useMemo(
    () => ({
      title: t('login.step-1.social_radar_title'),
      subtitle: t('login.step-1.social_radar_subtitle'),
    }),
    [t],
  );
};
