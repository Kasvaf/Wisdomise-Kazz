import { useTranslation } from 'react-i18next';
import { clsx } from 'clsx';
import { bxBell } from 'boxicons-quasar';
import { useCallback, useMemo } from 'react';
import Button from 'shared/Button';
import Icon from 'shared/Icon';
import { type AlertFormStepProps } from 'modules/alert/library/types';
import { useEditingAlert } from 'modules/alert/library/AlertProvider';
import { gtmClass } from 'utils/gtmClass';
import { CoinCategoriesSelect } from 'modules/alert/components/CoinCategoriesSelect';
import { NetworkSelect } from 'modules/alert/components/NetworkSelect';
import { AlertChannelsSelect } from 'modules/alert/components/AlertChannelsSelect';
import { isDebugMode } from 'utils/version';
import { type AlertMessenger } from 'api/alert';
import { FormControlWithLabel } from '../../components/FormControlWithLabel';

export function StepOne({
  onSubmit,
  loading,
  className,
  onDelete,
}: AlertFormStepProps) {
  const { t } = useTranslation('alerts');
  const {
    value: [value, setValue],
  } = useEditingAlert();

  const form = useMemo(
    () => ({
      'data_source': value.data_source ?? 'social_radar',
      'symbol.categories': JSON.parse(
        (value.conditions?.find(x => x.field_name === 'symbol.categories')
          ?.threshold as string) ?? '[]',
      ),
      'networks': JSON.parse(
        (value.conditions?.find(x => x.field_name === 'networks')
          ?.threshold as string) ?? '[]',
      ),
    }),
    [value],
  );
  const setForm = useCallback(
    (key: keyof typeof form, newValue: never) => {
      if (key === 'networks' || key === 'symbol.categories') {
        return setValue(p => ({
          ...(p as { data_source: 'social_radar' }),
          conditions: [
            ...((p.conditions ?? []).filter(
              x => x.field_name !== key,
            ) as never),
            {
              field_name: key,
              operator: 'CONTAINS_OBJECT_EACH',
              threshold: JSON.stringify(newValue),
            },
          ],
        }));
      }
      if (key === 'data_source') {
        return setValue(p => ({
          ...(p as { data_source: 'social_radar' }),
          data_source: newValue,
        }));
      }
    },
    [setValue],
  );

  return (
    <form
      className={clsx('space-y-6 text-sm font-light', className)}
      onSubmit={e => {
        e.preventDefault();
        onSubmit();
      }}
    >
      <>
        <FormControlWithLabel type="normal" className="w-full">
          <CoinCategoriesSelect
            className="w-full"
            value={form['symbol.categories']}
            onChange={x => setForm('symbol.categories', x as never)}
          />
        </FormControlWithLabel>
        <FormControlWithLabel type="normal" className="w-full">
          <NetworkSelect
            className="w-full"
            value={form.networks}
            onChange={x => setForm('networks', x as never)}
          />
        </FormControlWithLabel>
        <FormControlWithLabel type="normal" className="w-full">
          <AlertChannelsSelect
            className="w-full"
            onChange={x => setValue(p => ({ ...p, messengers: x as never }))}
            value={value.messengers ?? []}
            channels={[
              'EMAIL',
              'TELEGRAM',
              ...(isDebugMode ? (['WEB_PUSH'] as AlertMessenger[]) : []),
            ]}
          />
        </FormControlWithLabel>
        <div>
          <Button
            variant="primary"
            className={clsx(
              'mt-6 w-full grow',
              gtmClass('submit coin-radar-alert'),
            )}
            loading={loading}
            disabled={value.key ? false : (value.messengers ?? []).length === 0}
            onClick={e => {
              if (value.key && (value.messengers?.length ?? 0) < 1) {
                e.preventDefault();
                onDelete?.();
              } // else submit the form
            }}
          >
            {t('common.save-alert')}
            <Icon name={bxBell} className="ms-2" />
          </Button>
        </div>
      </>
    </form>
  );
}
