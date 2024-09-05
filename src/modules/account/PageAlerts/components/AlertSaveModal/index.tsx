import { useEffect, useRef, useState } from 'react';
import { type Alert } from 'api/alert';
import { DrawerModal } from 'shared/DrawerModal';
import { useAlertFormStep } from '../AlertFormStep';
import { DataSourceSelectForm } from '../DataSourceSelectForm';
import { ConditionForm } from '../ConditionForm';
import { NotifacationForm } from '../NotifacationForm';
import { AlertSubscriptionBanner } from '../AlertSubscriptionBanner';

export function AlertSaveModal({
  value,
  isOpen,
  onClose,
  onSubmit,
  lock,
  loading,
}: {
  value?: Partial<Alert<never>>;
  onSubmit?: (newAlert: Alert<never>) => void;
  lock?: boolean;
  isOpen?: boolean;
  onClose?: () => void;
  loading?: boolean;
}) {
  const latestIsOpen = useRef(isOpen);

  const [payload, setPayload] = useState<Partial<Alert<never>>>(value ?? {});

  const formStep = useAlertFormStep({
    dataSource: payload.dataSource,
    onClose,
  });

  useEffect(() => {
    if (isOpen && latestIsOpen.current === false) {
      setPayload(value ?? {});
      formStep.setStep(value?.dataSource ? 'condition' : 'data_source');
    }
    latestIsOpen.current = isOpen;
  }, [formStep, isOpen, value]);

  return (
    <DrawerModal
      open={isOpen}
      onClose={onClose}
      destroyOnClose
      className="max-w-lg mobile:!h-[85svh] mobile:max-w-full"
      title={formStep.header}
      closable={false}
    >
      {formStep.step === 'data_source' && (
        <DataSourceSelectForm
          className="mx-auto w-full max-w-[348px]"
          value={payload}
          onSubmit={newPayload => {
            setPayload(newPayload);
            formStep.setStep('condition');
          }}
        />
      )}
      {formStep.step === 'condition' && (
        <ConditionForm
          className="mx-auto w-full max-w-[420px]"
          value={payload}
          lock={lock}
          loading={loading}
          onSubmit={newPayload => {
            setPayload(newPayload);
            formStep.setStep('notification');
          }}
        />
      )}
      {formStep.step === 'notification' && (
        <NotifacationForm
          className="mx-auto w-full max-w-[420px]"
          value={payload}
          loading={loading}
          onSubmit={newPayload => {
            setPayload(newPayload);
            onSubmit?.(newPayload as Alert<never>);
          }}
        />
      )}

      {formStep.step !== 'data_source' && payload.dataSource && (
        <>
          <div className="my-10 h-px bg-v1-border-tertiary" />
          <AlertSubscriptionBanner className="mx-auto w-full max-w-[420px] rounded-xl" />
        </>
      )}
    </DrawerModal>
  );
}
