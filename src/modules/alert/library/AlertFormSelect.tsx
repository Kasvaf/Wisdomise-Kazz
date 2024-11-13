/* eslint-disable import/max-dependencies */
import { clsx } from 'clsx';
import { useTranslation } from 'react-i18next';
import { bxRightArrowAlt } from 'boxicons-quasar';
import { useState } from 'react';
import Icon from 'shared/Icon';
import { type AlertForm } from './types';
import { useEditingAlert } from './AlertProvider';

export function AlertFormSelect({
  onSubmit,
  className,
  forms,
}: {
  onSubmit: (newValue: string) => void;
  className?: string;
  forms: AlertForm[];
}) {
  const { t } = useTranslation('alerts');
  const [loading, setLoading] = useState(false);
  const [_, setValue] = useEditingAlert();

  return (
    <div
      className={clsx(
        'flex flex-col items-center gap-4',
        loading && 'pointer-events-none animate-pulse cursor-wait',
        className,
      )}
    >
      <h2 className="mb-4 text-base">{t('common.select-alert-type')}</h2>
      {forms
        .sort((a, b) => (a.disabled ? 1 : 0) - (b.disabled ? 1 : 0))
        .filter(x => !x.hidden)
        .map(({ icon: TypeIcon, ...x }, i) => (
          <button
            key={`${x.value}-${i}`}
            className="flex w-full items-center justify-start gap-3 rounded-xl bg-v1-surface-l4 p-4 transition-colors hover:enabled:bg-v1-surface-l5 disabled:bg-v1-surface-l2"
            disabled={x.disabled || loading}
            onClick={() => {
              setLoading(true);
              void (x?.defaultValue?.() ?? Promise.resolve({}))
                .then(defaultValue => {
                  setValue(defaultValue);
                  onSubmit?.(x.value);
                  return true;
                })
                .finally(() => setLoading(false));
            }}
          >
            <TypeIcon className="size-8 shrink-0 rounded-lg" />
            <div className="grow text-start">
              <h3 className="mb-1 text-xs text-v1-content-primary">
                {x.title}
              </h3>
              <div className="max-w-56 text-xxs text-v1-content-secondary">
                {x.subtitle}
              </div>
            </div>
            <span className="shrink-0">
              {x.disabled ? (
                <span className="h-4 rounded-full bg-v1-background-brand/10 px-2 text-xxs text-v1-content-brand">
                  {t('common:soon')}
                </span>
              ) : (
                <Icon name={bxRightArrowAlt} />
              )}
            </span>
          </button>
        ))}
    </div>
  );
}
