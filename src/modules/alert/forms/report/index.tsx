import { useTranslation } from 'react-i18next';
import { useHasFlag } from 'api';
import { useDeleteAlert, useAlerts, useSaveAlert } from 'api/alert';
import { type AlertForm } from 'modules/alert/library/types';
import { track } from 'config/segment';
import { ReactComponent as ReportIcon } from './report.svg';
import { StepOne } from './StepOne';

export const useReportAlert = (): AlertForm => {
  const { t } = useTranslation('alerts');
  const relatedAlerts = useAlerts({
    data_source: 'manual:social_radar_daily_report',
  });
  const saveAlertMutation = useSaveAlert();
  const deleteAlertMutation = useDeleteAlert();
  const hasFlag = useHasFlag();
  return {
    title: t('types.report.title'),
    subtitle: t('types.report.subtitle'),
    icon: ReportIcon,
    value: 'report',
    disabled: () => !hasFlag('/coin-radar/alerts?social_radar_report'),
    steps: [
      {
        component: StepOne,
        icon: ReportIcon,
        crumb: t('types.report.step-1.crumb'),
        title: t('types.report.step-1.crumb'),
        subtitle: t('types.report.step-1.subtitle'),
      },
    ],
    defaultValue: () =>
      relatedAlerts
        .refetch()
        .then(x => x.data?.length === 1)
        .then(isSubbed => ({
          data_source: 'manual:social_radar_daily_report',
          messengers: isSubbed ? ['EMAIL'] : [],
          conditions: [],
          config: {},
          params: [],
          state: 'ACTIVE',
        })),
    save: p =>
      saveAlertMutation.mutateAsync(p).then(() => {
        track('Click On', {
          place: 'social_radar_notification_changed',
          status: p?.messengers?.includes('EMAIL') ? 'on' : 'off',
        });
        return p;
      }),
    delete: p =>
      deleteAlertMutation.mutateAsync(p).then(() => {
        track('Click On', {
          place: 'social_radar_notification_changed',
          status: 'off',
        });
        return p;
      }),
    isCompatible: p => p.data_source === 'manual:social_radar_daily_report',
  };
};
