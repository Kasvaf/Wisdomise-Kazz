import { useTranslation } from 'react-i18next';
import { useHasFlag } from 'api';
import { useIsSubscribedToReport, useToggleSubscripeToReport } from 'api/alert';
import { type AlertForm } from 'modules/alert/library/types';
import { track } from 'config/segment';
import { ReactComponent as ReportIcon } from './report.svg';
import { StepOne } from './StepOne';

export const useReportAlert = (): AlertForm => {
  const { t } = useTranslation('alerts');
  const isSubbedToReport = useIsSubscribedToReport();
  const toggleSubscribe = useToggleSubscripeToReport();
  const hasFlag = useHasFlag();
  return {
    title: t('types.report.title'),
    subtitle: t('types.report.subtitle'),
    icon: ReportIcon,
    value: 'report',
    disabled: !hasFlag('/coin-radar/alerts?coinradar'),
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
      Promise.resolve({
        data_source: undefined,
        messengers: isSubbedToReport.data ? ['EMAIL'] : [],
        conditions: [],
        config: {},
        params: [],
        state: 'ACTIVE',
      }),
    save: p =>
      toggleSubscribe
        .mutateAsync(p?.messengers?.includes('EMAIL') ?? false)
        .then(() => {
          track('Click On', {
            place: 'social_radar_notification_changed',
            status: p?.messengers?.includes('EMAIL') ? 'on' : 'off',
          });
          return true;
        }),
    delete: () =>
      toggleSubscribe.mutateAsync(false).then(() => {
        track('Click On', {
          place: 'social_radar_notification_changed',
          status: 'off',
        });
        return true;
      }),
    isCompatible: p =>
      !p.data_source &&
      (p.messengers?.length === 0 || p?.messengers?.[0] === 'EMAIL'),
  };
};
