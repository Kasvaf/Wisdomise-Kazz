import { useTranslation } from 'react-i18next';
import { type AlertForm } from 'modules/alert/library/types';
import { ReactComponent as ScreenerIcon } from './screener.svg';

export const useScreenerAlert = (): AlertForm => {
  const { t } = useTranslation('alerts');
  return {
    title: t('types.screener.title'),
    subtitle: t('types.screener.subtitle'),
    icon: ScreenerIcon,
    value: 'screener',
    disabled: true,
  };
};
