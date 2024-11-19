import { useTranslation } from 'react-i18next';
import { type AlertFormGroup } from 'modules/alert/library/types';
import { useHasFlag } from 'api';
import { useAlerts, useDeleteAlert, useSaveAlert } from 'api/alert';
import Badge from 'shared/Badge';
import { ReactComponent as ScreenerIcon } from './screener.svg';
import { StepOne } from './StepOne';

export const useScreenerAlert = (): AlertFormGroup => {
  const { t } = useTranslation('alerts');
  const saveAlertMutation = useSaveAlert();
  const deleteAlertMutation = useDeleteAlert();
  const technicalRadarAlerts = useAlerts({
    data_source: 'technical_radar',
  });
  const socialRadarAlerts = useAlerts({
    data_source: 'social_radar',
  });
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
    children: [
      {
        title: t('types.social_radar_screener.title'),
        subtitle: t('types.social_radar_screener.subtitle'),
        icon: ScreenerIcon,
        value: 'social_radar',
        disabled: () => !hasFlag('/coin-radar/alerts?social_radar_screener'),
        steps: [
          {
            component: StepOne,
            icon: ScreenerIcon,
            title: t('types.social_radar_screener.step-1.title'),
            crumb: t('types.social_radar_screener.step-1.title'),
            subtitle: t('types.social_radar_screener.step-1.subtitle'),
          },
        ],
        defaultValue: () =>
          socialRadarAlerts.refetch().then(x =>
            x.data?.length
              ? x.data[0]
              : {
                  data_source: 'social_radar',
                  messengers: ['EMAIL'],
                  conditions: [
                    {
                      field_name: 'networks_slug',
                      operator: 'CONTAINS_EACH',
                      threshold: '[]',
                    },
                    {
                      field_name: 'symbol.categories',
                      operator: 'CONTAINS_OBJECT_EACH',
                      threshold: '[]',
                    },
                  ],
                  params: [],
                  config: {},
                  state: 'ACTIVE',
                },
          ),
        isCompatible: p => {
          return p.data_source === 'social_radar';
        },
        save: p => saveAlertMutation.mutateAsync(p),
        delete: p => deleteAlertMutation.mutateAsync(p),
      },
      {
        title: t('types.technical_radar_screener.title'),
        subtitle: t('types.technical_radar_screener.subtitle'),
        icon: ScreenerIcon,
        value: 'technical_radar',
        disabled: () => !hasFlag('/coin-radar/alerts?technical_radar_screener'),
        steps: [
          {
            component: StepOne,
            icon: ScreenerIcon,
            title: t('types.technical_radar_screener.step-1.title'),
            crumb: t('types.technical_radar_screener.step-1.title'),
            subtitle: t('types.technical_radar_screener.step-1.subtitle'),
          },
        ],
        defaultValue: () =>
          technicalRadarAlerts.refetch().then(x =>
            x.data?.length
              ? x.data[0]
              : {
                  data_source: 'technical_radar',
                  messengers: ['EMAIL'],
                  conditions: [
                    {
                      field_name: 'networks_slug',
                      operator: 'CONTAINS_EACH',
                      threshold: '[]',
                    },
                    {
                      field_name: 'symbol.categories',
                      operator: 'CONTAINS_OBJECT_EACH',
                      threshold: '[]',
                    },
                  ],
                  params: [],
                  config: {},
                  state: 'ACTIVE',
                },
          ),
        isCompatible: p => {
          return p.data_source === 'technical_radar';
        },
        save: p => saveAlertMutation.mutateAsync(p),
        delete: p => deleteAlertMutation.mutateAsync(p),
      },
    ],
  };
};
