import type { AlertForm } from 'modules/alert/library/types';
import { useTranslation } from 'react-i18next';
import { ReactComponent as WhaleIcon } from './whale.svg';

export const useWhaleAlert = (): AlertForm => {
  const { t } = useTranslation('alerts');
  return {
    title: t('types.whale.title'),
    subtitle: t('types.whale.subtitle'),
    icon: WhaleIcon,
    value: 'whale',
    disabled: () => true,
  };
};
