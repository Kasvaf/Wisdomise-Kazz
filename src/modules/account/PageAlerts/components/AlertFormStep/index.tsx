/* eslint-disable import/max-dependencies */
import { clsx } from 'clsx';
import { useTranslation } from 'react-i18next';
import { type FC, type ReactNode, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { bxChevronLeft, bxX } from 'boxicons-quasar';
import { type AlertDataSource } from 'api/alert';

import Icon from 'shared/Icon';
import { useDataSources } from '../DataSourceSelectForm';
import { ReactComponent as NotificationIcon } from './notification.svg';

type AlertStepType = 'data_source' | 'condition' | 'notification';

const AlertStep: FC<{
  icon: FC<{ className?: string }>;
  label?: ReactNode;
  isActive: boolean;
}> = ({ icon: Icon, label, isActive }) => (
  <div
    className={clsx(
      'relative flex size-12 shrink-0 flex-col items-center justify-center overflow-visible',
      isActive && ' border-v1-border-brand bg-v1-surface-l3',
      !isActive && 'border-transparent bg-v1-surface-l3 opacity-80',
    )}
  >
    <div
      className={clsx(
        'size-12 shrink-0 overflow-hidden rounded-lg border',
        'transition-all duration-300',
        isActive && ' border-v1-border-brand bg-v1-surface-l3',
        !isActive && 'border-transparent bg-v1-surface-l3',
      )}
    >
      <Icon className="relative size-full" />
    </div>
    <div
      className={clsx(
        'mt-2 w-max whitespace-normal text-sm font-light',
        isActive ? 'text-v1-content-primary' : 'text-v1-content-secondary',
      )}
    >
      {label}
    </div>
  </div>
);

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
  const { t } = useTranslation('alerts');
  const [step, setStep] = useState<AlertStepType>('data_source');
  const navigate = useNavigate();
  const dataSources = useDataSources();
  const dataSourceObject = dataSources.find(dt => dt.value === dataSource);
  const showConditionStep = dataSource
    ? ALERT_STEP_CONFIGS[dataSource].includes('condition') ||
      ALERT_STEP_CONFIGS[dataSource].length === 1
    : true;
  const showNotificationStep = dataSource
    ? ALERT_STEP_CONFIGS[dataSource].includes('notification') &&
      ALERT_STEP_CONFIGS[dataSource].length > 1
    : true;
  const showBackBtn =
    step === 'notification' && showConditionStep && showNotificationStep;

  return useMemo(
    () => ({
      header: (
        <div
          className={clsx('mt-4 space-y-12', step !== 'data_source' && 'mb-12')}
        >
          <div className="flex items-center gap-2">
            {showBackBtn && (
              <button
                onClick={() => setStep('condition')}
                className="size-9 shrink-0"
              >
                <Icon name={bxChevronLeft} size={32} />
              </button>
            )}
            <ul
              className={clsx(
                'flex grow items-center justify-start gap-1 text-xs font-light',
                '[&_li:last-child]:after:hidden [&_li]:after:ms-1 [&_li]:after:inline-block [&_li]:after:content-["/"]',
                '[&_li:last-child]:text-v1-content-primary [&_li]:cursor-pointer [&_li]:text-v1-content-secondary',
              )}
            >
              <li
                onClick={() => {
                  onClose?.();
                  navigate('/insight/alerts');
                }}
              >
                {t('common.alerts-list')}
              </li>
              {step !== 'data_source' && dataSourceObject && (
                <li onClick={() => setStep('condition')}>
                  {dataSourceObject.step}
                </li>
              )}
              {step === 'notification' &&
                showNotificationStep &&
                showConditionStep && (
                  <li onClick={() => setStep('notification')}>
                    {t('forms.notifications.step')}
                  </li>
                )}
            </ul>
            <button
              onClick={onClose}
              className="size-9 shrink-0 text-v1-content-secondary"
            >
              <Icon name={bxX} size={32} />
            </button>
          </div>
          {step !== 'data_source' && dataSourceObject && (
            <div
              className={clsx(
                'mx-auto flex max-w-xs items-start justify-center gap-2',
              )}
            >
              {showConditionStep && (
                <AlertStep
                  icon={dataSourceObject.icon}
                  isActive
                  label={dataSourceObject.step}
                />
              )}
              {showConditionStep && showNotificationStep && (
                <div
                  className={clsx(
                    'mt-3 h-px w-full max-w-32 grow overflow-hidden bg-transparent bg-gradient-to-r from-white',
                    step === 'notification' && 'to-white',
                    step !== 'notification' && 'to-transparent',
                    'transition-all duration-300',
                  )}
                />
              )}
              {showNotificationStep && (
                <AlertStep
                  icon={NotificationIcon}
                  isActive={step === 'notification'}
                  label={t('forms.notifications.step')}
                />
              )}
            </div>
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
    [
      step,
      showBackBtn,
      t,
      dataSourceObject,
      showNotificationStep,
      showConditionStep,
      onClose,
      navigate,
    ],
  );
};
