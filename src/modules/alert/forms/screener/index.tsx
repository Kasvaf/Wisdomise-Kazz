import { useTranslation } from 'react-i18next';
import { type AlertForm } from 'modules/alert/library/types';
import { useHasFlag } from 'api';
import { useDeleteAlert, useSaveAlert } from 'api/alert';
import Badge from 'shared/Badge';
import { ReactComponent as ScreenerIcon } from './screener.svg';
import { StepOne } from './StepOne';

export const useScreenerAlert = (): AlertForm => {
  const { t } = useTranslation('alerts');
  const saveAlertMutation = useSaveAlert();
  const deleteAlertMutation = useDeleteAlert();
  const hasFlag = useHasFlag();
  return {
    title: (
      <span className="inline-flex items-center gap-1">
        {t('types.screener.title')}
        <Badge color="wsdm" label={t('common:new')} />
      </span>
    ),
    subtitle: t('types.screener.subtitle'),
    icon: ScreenerIcon,
    value: 'screener',
    disabled: !hasFlag('/coin-radar/alerts?screener'),
    steps: [
      {
        component: StepOne,
        icon: ScreenerIcon,
        title: (
          <span className="inline-flex items-center gap-1">
            {t('types.screener.step-1.title')}
            <Badge color="wsdm" label={t('common:new')} />
          </span>
        ),
        crumb: t('types.screener.step-1.title'),
        subtitle: t('types.screener.step-1.subtitle'),
      },
    ],
    defaultValue: () =>
      Promise.resolve({
        data_source: 'social_radar',
        messengers: ['EMAIL'],
        conditions: [],
        params: [],
      }),
    isCompatible: p => {
      return p.data_source === 'social_radar';
    },
    save: p => saveAlertMutation.mutateAsync(p),
    delete: p => deleteAlertMutation.mutateAsync(p),
  };
};
