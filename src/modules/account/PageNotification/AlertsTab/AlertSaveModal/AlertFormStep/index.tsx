import { useState, type FC } from 'react';
import { clsx } from 'clsx';
import { useTranslation } from 'react-i18next';
import { ReactComponent as ProgressBoxIcon } from './progress.svg';
import { ReactComponent as DollarIcon } from './dollar.svg';
import { ReactComponent as NotificationIcon } from './notification.svg';

type AlertFormStepType = 'price' | 'notification';

export const useAlertFormStep = (step: AlertFormStepType) =>
  useState<AlertFormStepType>(step);

const AlertStep: FC<{
  icon: typeof DollarIcon;
  label?: string;
  isActive: boolean;
}> = ({ icon: Icon, label, isActive }) => (
  <div
    className={clsx(
      'relative flex size-12 shrink-0 flex-col items-center justify-center overflow-visible',
      'transition-all duration-300',
      !isActive && 'opacity-30',
    )}
  >
    <ProgressBoxIcon className="absolute inset-0 h-full w-full" />
    <Icon className="relative" />
    <p className="absolute -bottom-8 w-max whitespace-normal text-sm font-medium">
      {label}
    </p>
  </div>
);

export const AlertFormStep: FC<{
  step: AlertFormStepType;
  className?: string;
}> = ({ step, className }) => {
  const { t } = useTranslation('notifications');
  return (
    <div className={clsx('flex flex-col items-center space-y-4', className)}>
      <div className="inline-flex items-center justify-center gap-2 pb-10">
        <AlertStep
          icon={DollarIcon}
          isActive
          label={t('alerts.form.price-tab')}
        />
        <div
          className={clsx(
            'h-[3px] w-32 grow rounded-full bg-purple-600',
            'transition-all duration-300',
            step !== 'notification' && 'opacity-30',
          )}
        />
        <AlertStep
          icon={NotificationIcon}
          isActive={step === 'notification'}
          label={t('alerts.form.notif-tab')}
        />
      </div>
      <p className="text-center text-xs opacity-60">{t('alerts.form.title')}</p>
    </div>
  );
};
