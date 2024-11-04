import { clsx } from 'clsx';
import { useTranslation } from 'react-i18next';
import { useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { bxX } from 'boxicons-quasar';
import { type AlertDataSource } from 'api/alert';
import Icon from 'shared/Icon';
import { useDataSources } from '../DataSourceSelectForm';
import { ReactComponent as NotificationIcon } from './notification.svg';
import { AlertSteps } from './AlertSteps';
import { AlertBreadcrumb } from './AlertBreadcrumb';

type AlertStepType = 'data_source' | 'condition' | 'notification';

const ALERT_STEP_CONFIGS: Record<AlertDataSource, AlertStepType[]> = {
  'market_data': ['condition', 'notification'],
  'custom:coin_radar_notification': ['notification'],
};

export const useAlertFormStep = ({
  dataSource,
  onClose,
}: {
  dataSource?: AlertDataSource;
  onClose?: () => void;
}) => {
  const hadDataSource = useRef(!!dataSource); // is it for editing already created alert or is it for new alert?
  const { t } = useTranslation('alerts');
  const [step, setStep] = useState<AlertStepType>('data_source');
  const navigate = useNavigate();
  const dataSources = useDataSources();
  const dataSourceObject = dataSources.find(dt => dt.value === dataSource);
  return useMemo(
    () => ({
      content: (
        <div
          className={clsx('mt-4 space-y-12', step !== 'data_source' && 'mb-12')}
        >
          <div className="flex items-center gap-2">
            <AlertBreadcrumb
              className="grow"
              crumbs={[
                {
                  label: t('common.alerts-list'),
                  value: 'alerts',
                  accessableWithBack: false,
                  action: () => {
                    onClose?.();
                    navigate('/coin-radar/alerts');
                  },
                },
                !hadDataSource.current && {
                  value: 'data_source',
                  action: () => setStep('data_source'),
                  accessableWithBack: true,
                  hidden: true,
                },
                dataSourceObject &&
                  step !== 'data_source' && {
                    label: dataSourceObject.step,
                    value: 'condition',
                    accessableWithBack: true,
                    action: () => setStep('condition'),
                  },
                dataSource &&
                  ALERT_STEP_CONFIGS[dataSource].includes('notification') &&
                  ALERT_STEP_CONFIGS[dataSource].includes('condition') &&
                  step === 'notification' && {
                    label: t('forms.notifications.step'),
                    value: 'notification',
                    accessableWithBack: true,
                    action: () => setStep('notification'),
                  },
              ]}
            />
            <button
              onClick={onClose}
              className="size-9 shrink-0 text-v1-content-secondary"
            >
              <Icon name={bxX} size={32} />
            </button>
          </div>
          {step !== 'data_source' && dataSource && dataSourceObject && (
            <AlertSteps
              steps={[
                {
                  icon: dataSourceObject.icon,
                  label: dataSourceObject.title,
                  value: ALERT_STEP_CONFIGS[dataSource].includes('condition')
                    ? 'condition'
                    : 'notification',
                },
                ALERT_STEP_CONFIGS[dataSource].includes('notification') &&
                  ALERT_STEP_CONFIGS[dataSource].includes('condition') && {
                    icon: NotificationIcon,
                    label: t('forms.notifications.step'),
                    value: 'notification',
                  },
              ]}
              value={step}
            />
          )}
          {dataSourceObject?.stepSubtitle && (
            <div className="!mt-8 text-center text-xs font-light text-v1-content-secondary">
              {dataSourceObject.stepSubtitle}
            </div>
          )}
        </div>
      ),
      setStep,
      step,
    }),
    [step, t, dataSourceObject, onClose, dataSource, navigate],
  );
};
