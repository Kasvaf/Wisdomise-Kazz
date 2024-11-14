import { useTranslation } from 'react-i18next';
import { type AlertForm } from 'modules/alert/library/types';
import { ReactComponent as IndicatorIcon } from './indicator.svg';

export const useIndicatorAlert = (): AlertForm => {
  const { t } = useTranslation('alerts');
  return {
    title: t('types.indicator.title'),
    subtitle: t('types.indicator.subtitle'),
    icon: IndicatorIcon,
    value: 'indicator',
    disabled: () => true,
  };
};
