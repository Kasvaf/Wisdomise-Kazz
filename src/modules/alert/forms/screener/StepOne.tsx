import { bxBell } from 'boxicons-quasar';
import { clsx } from 'clsx';
import { AlertChannelsSelect } from 'modules/alert/components/AlertChannelsSelect';
import { CoinCategoriesSelect } from 'modules/alert/components/CoinCategoriesSelect';
import { FormControlWithLabel } from 'modules/alert/components/FormControlWithLabel';
import { NetworkSelect } from 'modules/alert/components/NetworkSelect';
import { useEditingAlert } from 'modules/alert/library/AlertProvider';
import type { AlertFormStepProps } from 'modules/alert/library/types';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useSubscription } from 'services/rest';
import type { AlertMessenger } from 'services/rest/alert';
import VipRedirectButton from 'shared/AccessShield/VipBanner/VipRedirectButton';
import Icon from 'shared/Icon';
import { useGlobalNetwork } from 'shared/useGlobalNetwork';
import { Button } from 'shared/v1-components/Button';
import { gtmClass } from 'utils/gtmClass';
import { isDebugMode } from 'utils/version';

export function StepOne({
  onSubmit,
  loading,
  className,
  onDelete,
  onClose,
}: AlertFormStepProps) {
  const { t } = useTranslation('alerts');
  const setDefaultValue = useRef(true);
  const [globalNetwork] = useGlobalNetwork();
  const { group } = useSubscription();

  const {
    value: [value, setValue],
  } = useEditingAlert();

  const form = useMemo(
    () => ({
      data_source: value.data_source ?? 'social_radar',
      'symbol.categories': JSON.parse(
        (value.conditions?.find(x => x.field_name === 'symbol.categories')
          ?.threshold as string) ?? '[]',
      ),
      networks: JSON.parse(
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

  useEffect(() => {
    if (!value.key && setDefaultValue.current) {
      setDefaultValue.current = false;
      setForm('networks', (globalNetwork ? [globalNetwork] : []) as never);
    }
  }, [value, setForm, globalNetwork]);

  return (
    <form
      className={clsx('space-y-6 font-light text-sm', className)}
      onSubmit={e => {
        e.preventDefault();
        onSubmit();
      }}
    >
      <FormControlWithLabel className="w-full" type="normal">
        <CoinCategoriesSelect
          className="w-full"
          onChange={x => setForm('symbol.categories', x as never)}
          value={form['symbol.categories']}
        />
      </FormControlWithLabel>
      <FormControlWithLabel className="w-full" type="normal">
        <NetworkSelect
          className="w-full"
          onChange={x => setForm('networks', x as never)}
          value={form.networks}
        />
      </FormControlWithLabel>
      <FormControlWithLabel className="w-full" type="normal">
        <AlertChannelsSelect
          channels={[
            'EMAIL',
            'TELEGRAM',
            ...(isDebugMode ? (['WEB_PUSH'] as AlertMessenger[]) : []),
          ]}
          className="w-full"
          onChange={x => setValue(p => ({ ...p, messengers: x as never }))}
          value={value.messengers ?? []}
        />
      </FormControlWithLabel>
      <div>
        {group === 'free' ? (
          <VipRedirectButton label="Upgrade to Set Alert" onClick={onClose} />
        ) : (
          <Button
            className={clsx(
              'mt-6 w-full grow',
              gtmClass('submit coin-radar-alert'),
            )}
            disabled={value.key ? false : (value.messengers ?? []).length === 0}
            loading={loading}
            onClick={e => {
              if (value.key && (value.messengers?.length ?? 0) < 1) {
                e.preventDefault();
                onDelete?.();
              } // else submit the form
            }}
            variant="white"
          >
            {t('common.save-alert')}
            <Icon className="ms-2" name={bxBell} />
          </Button>
        )}
      </div>
    </form>
  );
}
