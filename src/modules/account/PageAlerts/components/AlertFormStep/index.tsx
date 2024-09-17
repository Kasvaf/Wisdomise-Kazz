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

  return useMemo(
    () => ({
      header: (
        <>
          <div className="flex items-center gap-2">
            {step === 'notification' && (
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
              {step === 'notification' && (
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
          {step !== 'data_source' && dataSourceObject ? (
            <div
              className={clsx(
                'mx-auto mb-12 mt-16 flex max-w-xs items-start justify-center gap-2',
              )}
            >
              <AlertStep
                icon={dataSourceObject.icon}
                isActive
                label={dataSourceObject.step}
              />
              <div
                className={clsx(
                  'mt-3 h-px w-full max-w-32 grow overflow-hidden bg-transparent bg-gradient-to-r from-white',
                  step === 'notification' && 'to-white',
                  step !== 'notification' && 'to-transparent',
                  'transition-all duration-300',
                )}
              />
              <AlertStep
                icon={NotificationIcon}
                isActive={step === 'notification'}
                label={t('forms.notifications.step')}
              />
            </div>
          ) : (
            <div className="mb-16" />
          )}
        </>
      ),
      setStep,
      step,
    }),
    [t, step, dataSourceObject, onClose, navigate],
  );
};

export const useAlertFormStepOld = (step: AlertStepType) =>
  useState<AlertStepType>(step);

export function AlertFormStep({
  step,
  dataSource,
}: {
  step: AlertStepType;
  dataSource: AlertDataSource;
}) {
  const dataSources = useDataSources();
  const { t } = useTranslation('alerts');
  const dataSourceObject = dataSources.find(
    dt => dt.value === dataSource ?? 'market_data',
  );
  if (!dataSourceObject) throw new Error('unexpected');

  if (step === 'data_source') return null;

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="inline-flex items-center justify-center gap-2 pb-10">
        <AlertStep
          icon={dataSourceObject.icon}
          isActive
          label={dataSourceObject.step}
        />
        <div
          className={clsx(
            'h-[3px] w-32 grow rounded-full',
            step !== 'notification' && 'bg-white',
            step === 'notification' &&
              'bg-gradient-to-r from-white to-transparent',
            'transition-all duration-300',
          )}
        />
        <AlertStep
          icon={NotificationIcon}
          isActive={step === 'notification'}
          label={t('forms.notifications.step')}
        />
      </div>
      <div className="text-center text-xs opacity-60">
        {dataSourceObject.subtitle}
      </div>
    </div>
  );
}
