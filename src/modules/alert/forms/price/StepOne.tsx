import { bxRightArrowAlt } from 'boxicons-quasar';
import { clsx } from 'clsx';
import { PriceInput } from 'modules/alert/components/PriceInput';
import { useEditingAlert } from 'modules/alert/library/AlertProvider';
import type { AlertFormStepProps } from 'modules/alert/library/types';
import { useCallback, useMemo, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import Icon from 'shared/Icon';
import { Button } from 'shared/v1-components/Button';
import { formatNumber } from 'utils/numbers';
import { CoinPriceInfo } from '../../components/CoinPriceInfo';
import { CoinSelect } from '../../components/CoinSelect';
import { FormControlWithLabel } from '../../components/FormControlWithLabel';
import { OperatorSelect } from '../../components/OperatorSelect';

export function StepOne({ onSubmit, lock, className }: AlertFormStepProps) {
  const { t } = useTranslation('alerts');
  const {
    value: [value, setValue],
  } = useEditingAlert();
  const form = useMemo(
    () => ({
      base: value.params?.find(x => x.field_name === 'base')?.value as string,
      quote: value.params?.find(x => x.field_name === 'quote')?.value as string,
      operator: value.conditions?.[0].operator as string,
      threshold: value.conditions?.[0].threshold as string,
    }),
    [value],
  );
  const setForm = useCallback(
    (key: keyof typeof form, newValue: never) => {
      if (key === 'base' || key === 'quote') {
        return setValue(p => ({
          ...(p as { data_source: 'market_data' }),
          params: [
            ...(p.params ?? []).filter(x => x.field_name !== key),
            {
              field_name: key,
              value: newValue,
            },
          ],
        }));
      }
      if (key === 'operator') {
        return setValue(p => ({
          ...(p as { data_source: 'market_data' }),
          conditions: [
            {
              field_name: 'last_price',
              threshold: p.conditions?.[0].threshold as never,
              operator: newValue,
            },
          ],
        }));
      }
      return setValue(p => ({
        ...(p as { data_source: 'market_data' }),
        conditions: [
          {
            field_name: 'last_price',
            operator: p.conditions?.[0].operator as never,
            threshold: newValue,
          },
        ],
      }));
    },
    [setValue],
  );

  const [isPriceTouched, setIsPriceTouched] = useState(form.threshold !== '0');

  return (
    <form
      className={clsx(
        'text-center font-light text-sm leading-[4rem]',
        className,
      )}
      onSubmit={e => {
        e.preventDefault();
        onSubmit();
      }}
    >
      <Trans
        components={{
          Badge: <FormControlWithLabel type="inline" />,
          Br: <br />,
          Base: (
            <CoinSelect
              className="inline-block min-w-20"
              disabled={lock}
              onChange={newBase => setForm('base', newBase as never)}
              value={form.base}
            />
          ),
          Operator: (
            <OperatorSelect
              onChange={newOperator =>
                setForm('operator', newOperator as never)
              }
              showEqual={false}
              value={form.operator}
            />
          ),
          Threshold: (
            <PriceInput
              className="inline-block w-32"
              onChange={newThreshold => {
                setIsPriceTouched(true);
                setForm('threshold', newThreshold.target.value as never);
              }}
              placeholder="Price"
              value={form.threshold ?? '0'}
            />
          ),
          Quote: (
            <CoinSelect
              className="inline-block min-w-20"
              disabled
              onChange={newQuote => setForm('quote', newQuote as never)}
              value={form.quote}
            />
          ),
        }}
        i18nKey="types.price.sentence"
        ns="alerts"
      />
      {form.base && (
        <CoinPriceInfo
          className="mt-6"
          onCurrentPriceChange={newPrice => {
            if (!isPriceTouched) {
              setForm(
                'threshold',
                formatNumber(newPrice + newPrice * 0.01, {
                  compactInteger: false,
                  decimalLength: 1,
                  minifyDecimalRepeats: false,
                  separateByComma: false,
                }) as never,
              );
            }
          }}
          slug={form.base}
        />
      )}

      <div className="mt-6 flex items-center justify-stretch gap-2">
        <Button
          className="grow"
          disabled={!form.threshold || +form.threshold < 0}
          variant="white"
        >
          {t('common:actions.next')}
          <Icon className="ms-2" name={bxRightArrowAlt} />
        </Button>
      </div>
    </form>
  );
}
