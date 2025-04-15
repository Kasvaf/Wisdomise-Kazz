import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { type AlertFormGroup } from 'modules/alert/library/types';
import {
  useAlerts,
  useDeleteAlert,
  useSaveAlert,
  useHasFlag,
  useSubscription,
} from 'api';
import { DebugPin } from 'shared/DebugPin';
import { ReactComponent as ScreenerIcon } from './screener.svg';
import { StepOne } from './StepOne';

export const useScreenerAlert = (): AlertFormGroup => {
  const { t } = useTranslation('alerts');
  const saveAlertMutation = useSaveAlert();
  const deleteAlertMutation = useDeleteAlert();
  const subscription = useSubscription();
  const navigate = useNavigate();
  const technicalRadarAlerts = useAlerts({
    data_source: 'technical_radar',
  });
  const socialRadarAlerts = useAlerts({
    data_source: 'social_radar',
  });
  const coinRadarAlerts = useAlerts({
    data_source: 'coin_radar',
  });
  const hasFlag = useHasFlag();
  return {
    title: t('types.screener.title') + ' (VIP Access)',
    subtitle: t('types.screener.subtitle'),
    icon: ScreenerIcon,
    value: 'screener',
    onClick: () => {
      if (subscription.level === 0) {
        void navigate('/account/billing');
      }
    },
    children: [
      {
        title: (
          <>
            <DebugPin
              title="/coin-radar/alerts?coin_radar_screener"
              color="orange"
            />
            {t('types.coin_radar_screener.title')}
          </>
        ),
        subtitle: t('types.coin_radar_screener.subtitle'),
        icon: ScreenerIcon,
        value: 'coin_radar',
        disabled: () => !hasFlag('/coin-radar/alerts?coin_radar_screener'),
        steps: [
          {
            component: StepOne,
            icon: ScreenerIcon,
            title: t('types.coin_radar_screener.step-1.title'),
            crumb: t('types.coin_radar_screener.step-1.title'),
            subtitle: t('types.coin_radar_screener.step-1.subtitle'),
          },
        ],
        defaultValue: () =>
          coinRadarAlerts.refetch().then(x =>
            x.data?.length
              ? x.data[0]
              : {
                  data_source: 'coin_radar',
                  messengers: ['EMAIL'],
                  conditions: [
                    {
                      field_name: 'networks',
                      operator: 'CONTAINS_OBJECT_EACH',
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
          return p.data_source === 'coin_radar';
        },
        save: p => saveAlertMutation.mutateAsync(p),
        delete: p => deleteAlertMutation.mutateAsync(p),
      },
      {
        title: (
          <>
            <DebugPin
              title="/coin-radar/alerts?social_radar_screener"
              color="orange"
            />
            {t('types.social_radar_screener.title')}
          </>
        ),
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
                      field_name: 'networks',
                      operator: 'CONTAINS_OBJECT_EACH',
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
        title: (
          <>
            <DebugPin
              title="/coin-radar/alerts?technical_radar_screener"
              color="orange"
            />
            {t('types.technical_radar_screener.title')}
          </>
        ),
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
                      field_name: 'networks',
                      operator: 'CONTAINS_OBJECT_EACH',
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
