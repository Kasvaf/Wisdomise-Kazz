import { useTranslation } from 'react-i18next';
import { useHasFlag } from 'api';
import { useDeleteAlert, useSaveAlert } from 'api/alert';
import { type AlertForm } from 'modules/alert/library/types';
import { ReactComponent as PriceIcon } from './price.svg';
import { ReactComponent as NotificationIcon } from './notification.svg';
import { StepOne } from './StepOne';
import { StepTwo } from './StepTwo';

export const usePriceAlert = (): AlertForm => {
  const { t } = useTranslation('alerts');
  const saveAlertMutation = useSaveAlert();
  const deleteAlertMutation = useDeleteAlert();
  const hasFlag = useHasFlag();
  return {
    title: t('types.price.title'),
    subtitle: t('types.price.subtitle'),
    icon: PriceIcon,
    value: 'price',
    disabled: () => !hasFlag('/coin-radar/alerts?price'),
    steps: [
      {
        crumb: t('types.price.step-1.crumb'),
        icon: PriceIcon,
        title: t('types.price.title'),
        component: StepOne,
      },
      {
        crumb: t('types.price.step-2.crumb'),
        icon: NotificationIcon,
        title: t('types.price.step-2.crumb'),
        component: StepTwo,
      },
    ],
    isCompatible: p => {
      return !!(
        p.data_source === 'market_data' &&
        p.params?.some(x => x.field_name === 'base')
      );
    },
    save: p => saveAlertMutation.mutateAsync(p),
    delete: p => deleteAlertMutation.mutateAsync(p),
    defaultValue: () =>
      Promise.resolve({
        data_source: 'market_data',
        messengers: ['EMAIL'],
        conditions: [
          {
            field_name: 'last_price',
            operator: 'GREATER',
            threshold: '0',
          },
        ],
        params: [
          {
            field_name: 'base',
            value: 'bitcoin',
          },
          {
            field_name: 'quote',
            value: 'tether',
          },
        ],
        config: {
          dnd_interval: 3600,
          one_time: false,
        },
        state: 'ACTIVE',
      }),
  };
};
