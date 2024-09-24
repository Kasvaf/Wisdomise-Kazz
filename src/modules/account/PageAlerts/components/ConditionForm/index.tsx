/* eslint-disable import/max-dependencies */
import { clsx } from 'clsx';
import { Controller, useForm, type UseFormReturn } from 'react-hook-form';
import { bxRightArrowAlt } from 'boxicons-quasar';
import { useEffect } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import Button from 'shared/Button';
import { type AlertDataSource, type Alert } from 'api/alert';
import Icon from 'shared/Icon';
import { CoinPriceInfo } from '../CoinPriceInfo';
import { CoinSelect } from '../CoinSelect';
import { OperatorSelect } from '../OperatorSelect';
import { PriceInput } from '../PriceInput';
import { FormControlWithLabel } from '../FormControlWithLabel';

export function ConditionForm<
  D extends AlertDataSource,
  A extends Partial<Alert<D>>,
>({
  value,
  onSubmit,
  lock,
  loading,
  className,
}: {
  value: A;
  onSubmit?: (newValue: A) => void;
  lock?: boolean;
  loading?: boolean;
  className?: string;
}) {
  if (!value.dataSource) throw new Error('unhandled');

  const { t } = useTranslation('alerts');

  const alertForm = useForm<A>({
    resolver: values => {
      if (values.dataSource === 'market_data') {
        return {
          errors: {
            ...(!/^\d*\.?\d+$/g.test(values.condition?.threshold ?? '') && {
              condition: 'error',
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

  useEffect(() => {
    if (value.dataSource === 'market_data') {
      const valueAsMarketData = value as Partial<Alert<'market_data'>>;
      alertFormAsMarketData.reset({
        ...valueAsMarketData,
        params: {
          ...valueAsMarketData?.params,
          base: valueAsMarketData?.params?.base ?? 'bitcoin',
          // market_name: value?.params?.market_name ?? 'BINANCE',
          // market_type: value?.params?.market_type ?? 'SPOT',
          quote: valueAsMarketData?.params?.quote ?? 'tether',
        },
        condition: {
          ...valueAsMarketData?.condition,
          field_name: valueAsMarketData?.condition?.field_name ?? 'last_price',
          operator: valueAsMarketData?.condition?.operator ?? 'GREATER',
          threshold: valueAsMarketData?.condition?.threshold ?? '0.0',
        },
      });
    } else if (value.dataSource === 'custom:coin_radar_notification') {
      onSubmit?.(value);
    }
  }, [value, alertFormAsMarketData, onSubmit]);

  const selectedCoin =
    value.dataSource === 'market_data'
      ? alertFormAsMarketData.watch('params.base')
      : undefined;

  return (
    <form
      className={clsx(
        'mx-auto w-full max-w-[420px] text-center text-sm font-light leading-[4rem]',
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
          <Trans
            i18nKey="forms.price.sentence"
            ns="alerts"
            components={{
              Badge: <FormControlWithLabel type="inline" />,
              Br: <br />,
              Base: (
                <Controller
                  control={alertFormAsMarketData.control}
                  name="params.base"
                  render={({ field: { value: fieldValue, onChange } }) => (
                    <CoinSelect
                      className="inline-block min-w-20"
                      onChange={onChange}
                      value={fieldValue}
                      disabled={value?.params?.base !== undefined && lock}
                    />
                  )}
                />
              ),
              Operator: (
                <Controller
                  control={alertFormAsMarketData.control}
                  name="condition.operator"
                  render={({ field: { value: fieldValue, onChange } }) => (
                    <OperatorSelect
                      onChange={onChange}
                      value={fieldValue}
                      showEqual={false}
                    />
                  )}
                />
              ),
              Threshold: (
                <Controller
                  control={alertFormAsMarketData.control}
                  name="condition.threshold"
                  render={({ field: { value: fieldValue, onChange } }) => (
                    <PriceInput
                      onChange={onChange}
                      value={fieldValue || ''}
                      placeholder="Price"
                      className="inline-block w-32"
                    />
                  )}
                />
              ),
              Quote: (
                <Controller
                  control={alertFormAsMarketData.control}
                  name="params.quote"
                  render={({ field: { value: fieldValue, onChange } }) => (
                    <CoinSelect
                      value={fieldValue}
                      onChange={onChange}
                      disabled
                    />
                  )}
                />
              ),
              // Exchange: (
              //   <Controller
              //     control={alertFormAsMarketData.control}
              //     name="params.market_name"
              //     render={({ field: { value: fieldValue, onChange } }) => (
              //       <ExchangeSelect
              //         onChange={onChange}
              //         value={fieldValue}
              //         marketType={value?.params?.market_type || 'SPOT'}
              //       />
              //     )}
              //   />
              // ),
            }}
          />
          {selectedCoin && (
            <CoinPriceInfo
              slug={selectedCoin}
              className="mt-6"
              onCurrentPriceChange={newPrice => {
                if (
                  !alertFormAsMarketData.formState.dirtyFields.condition
                    ?.threshold &&
                  !value.condition?.threshold
                ) {
                  alertFormAsMarketData.setValue(
                    'condition.threshold',
                    newPrice.toString(),
                  );
                }
              }}
            />
          )}
        </>
      )}

      <div className="mt-6 flex items-center justify-stretch gap-2">
        <Button
          variant="primary"
          className="grow"
          disabled={loading || !alertForm.formState.isValid}
        >
          {t('common:actions.next')}
          <Icon name={bxRightArrowAlt} className="ms-2" />
        </Button>
      </div>
    </form>
  );
}
