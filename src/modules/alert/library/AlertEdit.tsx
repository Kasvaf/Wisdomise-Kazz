import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AlertBreadcrumb, type AlertCrumb } from './AlertBreadcrumb';
import { AlertNavbarButton } from './AlertNavbarButton';
import { useEditingAlert } from './AlertProvider';
import { AlertFormSelect } from './AlertFormSelect';
import { AlertSteps } from './AlertSteps';
import { AlertStepInfo } from './AlertStepInfo';

export function AlertEdit({
  onClose,
  onFinish,
  lock,
}: {
  onClose: () => void;
  onFinish: () => void;
  lock?: boolean;
}) {
  const { t } = useTranslation('alerts');

  const {
    value: [value, setValue],
    forms,
  } = useEditingAlert();

  const matchedForm = useMemo(() => {
    return forms
      .flatMap(x => ('children' in x ? x.children : x))
      .find(x => x.isCompatible?.(value as never) ?? false);
  }, [value, forms]);

  const [step, setStep] = useState<number>(0);

  const [loading, setLoading] = useState(false);

  const activeStepObject = matchedForm?.steps?.[step];

  const ActiveStepComponent = activeStepObject?.component;

  const crumbs: AlertCrumb[] = [
    {
      label: t('common.alerts-list'),
      action: lock
        ? undefined
        : () => {
            setStep(0);
            setValue({});
          },
    },
    ...((matchedForm?.steps ?? [])
      .map((theStep, i) => ({
        label: theStep.crumb ?? theStep.title,
        action: () => {
          setStep(i);
        },
      }))
      .slice(0, step + 1) ?? []),
  ];

  return (
    <div className="flex flex-col items-stretch gap-4">
      <div className="flex w-full items-center gap-2 px-0 py-4">
        {crumbs.filter(r => r.action).length > 1 && (
          <AlertNavbarButton
            type="back"
            onClick={() => crumbs.at(-2)?.action?.()}
          />
        )}
        <AlertBreadcrumb crumbs={crumbs} className="grow" />
        <AlertNavbarButton type="close" onClick={onClose} />
      </div>

      {matchedForm && (
        <div className="mt-4 flex w-full justify-center">
          <AlertSteps
            steps={(matchedForm?.steps ?? []).map((theStep, index) => ({
              icon: theStep.icon,
              value: index,
              label: theStep.title,
            }))}
            value={step}
          />
        </div>
      )}

      {activeStepObject?.subtitle && (
        <div className="mt-4 flex w-full justify-center">
          <AlertStepInfo
            content={activeStepObject.subtitle}
            className="max-w-xs"
          />
        </div>
      )}

      {!matchedForm && (
        <div className="flex w-full justify-center">
          <AlertFormSelect
            className="w-full max-w-[348px]"
            onSubmit={() => setStep(0)}
          />
        </div>
      )}
      {matchedForm && ActiveStepComponent && (
        <div className="mt-16 flex w-full justify-center">
          <ActiveStepComponent
            loading={loading}
            className="w-full max-w-[420px]"
            lock={lock}
            onDelete={() => {
              setLoading(true);
              matchedForm
                .delete?.(value)
                .then(x => {
                  onFinish();
                  return x;
                })
                .finally(() => {
                  setLoading(false);
                });
            }}
            onSubmit={() => {
              if (step < (matchedForm.steps ?? []).length - 1) {
                setStep(step + 1);
              } else {
                setLoading(true);
                matchedForm
                  .save?.(value)
                  .then(x => {
                    onFinish();
                    return x;
                  })
                  .finally(() => {
                    setLoading(false);
                  });
              }
            }}
            onClose={onClose}
          />
        </div>
      )}
    </div>
  );
}
