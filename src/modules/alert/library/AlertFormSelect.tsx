import { bxChevronDown, bxChevronRight } from 'boxicons-quasar';
import { clsx } from 'clsx';
import { Fragment, useState } from 'react';
import AnimateHeight from 'react-animate-height';
import { useTranslation } from 'react-i18next';
import Icon from 'shared/Icon';
import Spinner from 'shared/Spinner';
import { useEditingAlert } from './AlertProvider';
import type { AlertForm, AlertFormGroup } from './types';

function Soon() {
  const { t } = useTranslation('alerts');
  return (
    <span className="h-4 rounded-full bg-v1-background-brand/10 px-2 text-2xs text-v1-content-brand">
      {t('common:soon')}
    </span>
  );
}

function AlertFormName({
  value,
  className,
  minimal,
}: {
  value: AlertForm | AlertFormGroup;
  className?: string;
  minimal?: boolean;
}) {
  return (
    <div className={clsx('flex items-center gap-3', className)}>
      {!minimal && <value.icon className="size-8 shrink-0 rounded-lg" />}
      <div className="grow text-start">
        <h3 className="mb-1 text-v1-content-primary text-xs">{value.title}</h3>
        {!minimal && (
          <div className="max-w-56 text-2xs text-v1-content-secondary">
            {value.subtitle}
          </div>
        )}
      </div>
    </div>
  );
}

function AlertFormButton({
  value,
  loading,
  onSelect,
  minimal,
}: {
  value: AlertForm;
  loading?: boolean;
  onSelect: (form: AlertForm) => void;
  minimal?: boolean;
}) {
  return (
    <button
      className={clsx(
        'flex w-full items-center justify-start gap-3 overflow-hidden',
        'bg-v1-surface-l2 p-4 transition-colors hover:enabled:bg-v1-surface-l3 disabled:bg-v1-surface-l1',
        !minimal && 'rounded-xl',
      )}
      disabled={value.disabled?.() || loading}
      onClick={() => onSelect(value)}
    >
      <AlertFormName className="grow" minimal={minimal} value={value} />
      <span className={'shrink-0'}>
        {value.disabled?.() ? <Soon /> : <Icon name={bxChevronRight} />}
      </span>
    </button>
  );
}

function AlertFormGroupButton({
  value,
  onSelect,
}: {
  value: AlertFormGroup;
  onSelect: (value: AlertForm) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="overflow-hidden rounded-xl">
      <button
        className={clsx(
          'flex w-full items-center justify-start gap-3 p-4',
          'bg-v1-surface-l2 transition-colors hover:enabled:bg-v1-surface-l3 disabled:bg-v1-surface-l1',
          expanded && '!bg-v1-surface-l6',
        )}
        disabled={value.disabled?.()}
        onClick={() => {
          value.onClick?.();
          setExpanded(p => !p);
        }}
      >
        <AlertFormName className="grow" value={value} />
        <span
          className={clsx('shrink-0 transition-all', expanded && 'rotate-180')}
        >
          {value.disabled?.() ? <Soon /> : <Icon name={bxChevronDown} />}
        </span>
      </button>
      <AnimateHeight duration={300} height={expanded ? 'auto' : 0}>
        <div className="w-full border-t border-t-v1-surface-l3">
          {value.children
            .filter(x => !x.hidden)
            .sort((a, b) => (a.disabled?.() ? 1 : 0) - (b.disabled?.() ? 1 : 0))
            .map(x => (
              <AlertFormButton
                key={x.value}
                minimal
                onSelect={() => onSelect(x)}
                value={x}
              />
            ))}
        </div>
      </AnimateHeight>
    </div>
  );
}

export function AlertFormSelect({
  onSubmit,
  className,
}: {
  onSubmit: (newValue: string) => void;
  className?: string;
}) {
  const { t } = useTranslation('alerts');
  const [loading, setLoading] = useState(false);
  const {
    value: [_, setValue],
    forms,
  } = useEditingAlert();

  const handleSubmit = (x: AlertForm) => {
    setLoading(true);
    void (x?.defaultValue?.() ?? Promise.resolve({}))
      .then(defaultValue => {
        setValue(defaultValue);
        onSubmit?.(x.value);
        return true;
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className={clsx('relative', className)}>
      <div
        className={clsx(
          !loading && 'hidden',
          'absolute inset-0 flex size-full items-center justify-center',
        )}
      >
        <Spinner />
      </div>
      <div
        className={clsx(
          'space-y-4',
          loading && 'pointer-events-none opacity-0',
        )}
      >
        <h2 className="mb-4 text-base">{t('common.select-alert-type')}</h2>
        {forms
          .filter(x => !x.hidden)
          .sort((a, b) => (a.disabled?.() ? 1 : 0) - (b.disabled?.() ? 1 : 0))
          .map((x, i) => (
            <Fragment key={`${x.value}-${i}`}>
              {'children' in x ? (
                <AlertFormGroupButton onSelect={handleSubmit} value={x} />
              ) : (
                <AlertFormButton onSelect={handleSubmit} value={x} />
              )}
            </Fragment>
          ))}
      </div>
    </div>
  );
}
