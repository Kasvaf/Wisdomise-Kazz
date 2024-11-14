import { useTranslation } from 'react-i18next';
import { type AlertForm } from 'modules/alert/library/types';
import { ReactComponent as SignalerIcon } from './signaler.svg';

export const useSignalerAlert = (): AlertForm => {
  const { t } = useTranslation('alerts');
  return {
    title: t('types.signaler.title'),
    subtitle: t('types.signaler.subtitle'),
    icon: SignalerIcon,
    value: 'signaler',
    disabled: () => true,
  };
};
