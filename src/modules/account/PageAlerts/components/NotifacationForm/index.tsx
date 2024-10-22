/* eslint-disable import/max-dependencies */
import { clsx } from 'clsx';
import { Controller, useForm, type UseFormReturn } from 'react-hook-form';
import { bxBell } from 'boxicons-quasar';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Button from 'shared/Button';
import {
  type AlertMessanger,
  type Alert,
  type AlertDataSource,
} from 'api/alert';
import { Toggle } from 'shared/Toggle';
import Icon from 'shared/Icon';
import { IntervalSelect } from '../IntervalSelect';
import { AlertChannelsSelect } from '../AlertChannelsSelect';
import { FormControlWithLabel } from '../FormControlWithLabel';
import { ReactComponent as CooldownIcon } from './cooldown.svg';
import { ReactComponent as FrequencyIcon } from './frequency.svg';

export function NotifacationForm<
  D extends AlertDataSource,
  A extends Partial<Alert<D>>,
>({
  value,
  loading,
  onSubmit,
  className,
}: {
  value: A;
  onSubmit?: (newAlert: A) => void;
  loading?: boolean;
  className?: string;
}) {
  const { t } = useTranslation('alerts');

  const alertForm = useForm<A>({
    resolver: values => {
      if (values.dataSource === 'market_data') {
        return {
          errors: {
            ...((values.messengers?.length || 0) < 1 && {
              messengers: 'error',
            }),
          },
          values,
        };
      }
      return {
        errors: {},
        values,
      };
    },
  });
  const alertFormAsMarketData = alertForm as unknown as UseFormReturn<
    Partial<Alert<'market_data'>>
  >;
  const alertFormAsCoinRadarNotif = alertForm as unknown as UseFormReturn<
    Partial<Alert<'custom:coin_radar_notification'>>
  >;

  useEffect(() => {
    if (value.dataSource === 'market_data') {
      alertFormAsMarketData.reset({
        ...value,
        dataSource: 'market_data',
        messengers: value.messengers ?? ['EMAIL'],
        state: value?.state === 'DISABLED' ? 'DISABLED' : 'ACTIVE',
        config: {
          ...value.config,
          dnd_interval: value.config?.dnd_interval ?? 3600,
          one_time: value.config?.one_time ?? false,
        },
      });
    } else if (value.dataSource === 'custom:coin_radar_notification') {
      alertFormAsCoinRadarNotif.reset({
        ...alertFormAsCoinRadarNotif,
        dataSource: 'custom:coin_radar_notification',
        messengers: value.messengers ?? ['EMAIL'],
      });
    }
  }, [value, alertFormAsMarketData, alertFormAsCoinRadarNotif]);

  return (
    <form
      className={clsx(
        'space-y-6 text-base font-normal',
        loading && 'pointer-events-none animate-pulse',
        className,
      )}
      onSubmit={alertForm.handleSubmit(dto => {
        onSubmit?.(dto);
        return Promise.resolve();
      })}
    >
      {value.dataSource === 'market_data' && (
        <>
          <FormControlWithLabel type="normal">
            <Controller
              control={alertFormAsMarketData.control}
              name="messengers"
              render={({ field: { value: fieldValue, onChange } }) => (
                <AlertChannelsSelect
                  onChange={onChange}
                  value={fieldValue as AlertMessanger[]}
                />
              )}
            />
          </FormControlWithLabel>

          <FormControlWithLabel
            label={
              <>
                <CooldownIcon />
                {t('forms.notifications.cooldown')}
              </>
            }
            type="inline"
            className="!flex justify-between"
            info={t('forms.notifications.cooldown-info')}
          >
            <Controller
              control={alertFormAsMarketData.control}
              name="config.dnd_interval"
              render={({ field: { value: fieldValue, onChange } }) => (
                <IntervalSelect
                  onChange={onChange}
                  value={fieldValue}
                  className="block"
                  cooldownMode
                />
              )}
            />
          </FormControlWithLabel>

          <FormControlWithLabel
            label={
              <>
                <FrequencyIcon />
                {t('forms.notifications.disable-after-trigger')}
              </>
            }
            type="inline"
            className="!flex justify-between"
          >
            <Controller
              control={alertFormAsMarketData.control}
              name="config.one_time"
              render={({ field: { value: fieldValue, onChange } }) => (
                <Toggle onChange={onChange} checked={fieldValue} />
              )}
            />
          </FormControlWithLabel>
          <div>
            <Button
              variant="primary"
              className="mt-6 w-full grow"
              loading={loading}
              disabled={loading || !alertFormAsMarketData.formState.isValid}
              data-id="submit_price-alert"
            >
              {t('common.set-alert')}
              <Icon name={bxBell} className="ms-2" />
            </Button>
          </div>
        </>
      )}
      {value.dataSource === 'custom:coin_radar_notification' && (
        <>
          <FormControlWithLabel
            label={
              <>
                <CooldownIcon />
                {t('forms.notifications.interval')}
              </>
            }
            type="inline"
            className="!flex justify-between"
          >
            <IntervalSelect disabled value={86_400} cooldownMode={false} />
          </FormControlWithLabel>
          <FormControlWithLabel type="normal">
            <Controller
              control={alertFormAsCoinRadarNotif.control}
              name="messengers"
              render={({ field: { value: fieldValue, onChange } }) => (
                <AlertChannelsSelect
                  onChange={onChange}
                  value={fieldValue as AlertMessanger[]}
                  channels={['EMAIL']}
                />
              )}
            />
          </FormControlWithLabel>
          <div>
            <Button
              variant="primary"
              className="mt-6 w-full grow"
              loading={loading}
              disabled={loading || !alertFormAsCoinRadarNotif.formState.isValid}
              data-id="submit_coin-radar-alert"
            >
              {t('common.save-alert')}
              <Icon name={bxBell} className="ms-2" />
            </Button>
          </div>
        </>
      )}
    </form>
  );
}
