import { bxRightArrowAlt } from 'boxicons-quasar';
import { Trans, useTranslation } from 'react-i18next';
import { useCallback, useMemo, useState } from 'react';
import { clsx } from 'clsx';
import Button from 'shared/Button';
import Icon from 'shared/Icon';
import { formatNumber } from 'utils/numbers';
import { type AlertFormStepProps } from 'modules/alert/library/types';
import { useEditingAlert } from 'modules/alert/library/AlertProvider';
import { PriceInput } from 'modules/alert/components/PriceInput';
import { CoinPriceInfo } from '../../components/CoinPriceInfo';
import { CoinSelect } from '../../components/CoinSelect';
import { OperatorSelect } from '../../components/OperatorSelect';
import { FormControlWithLabel } from '../../components/FormControlWithLabel';

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
        'text-center text-sm font-light leading-[4rem]',
        className,
      )}
      onSubmit={e => {
        e.preventDefault();
        onSubmit();
      }}
    >
      <>
        <Trans
          i18nKey="types.price.sentence"
          ns="alerts"
          components={{
            Badge: <FormControlWithLabel type="inline" />,
            Br: <br />,
            Base: (
              <CoinSelect
                className="inline-block min-w-20"
                onChange={newBase => setForm('base', newBase as never)}
                value={form.base}
                disabled={lock}
              />
            ),
            Operator: (
              <OperatorSelect
                onChange={newOperator =>
                  setForm('operator', newOperator as never)
                }
                value={form.operator}
                showEqual={false}
              />
            ),
            Threshold: (
              <PriceInput
                onChange={newThreshold => {
                  setIsPriceTouched(true);
                  setForm('threshold', newThreshold.target.value as never);
                }}
                value={form.threshold ?? '0'}
                placeholder="Price"
                className="inline-block w-32"
              />
            ),
            Quote: (
              <CoinSelect
                className="inline-block min-w-20"
                onChange={newQuote => setForm('quote', newQuote as never)}
                value={form.quote}
                disabled
              />
            ),
          }}
        />
        {form.base && (
          <CoinPriceInfo
            slug={form.base}
            className="mt-6"
            onCurrentPriceChange={newPrice => {
              if (!isPriceTouched) {
                setForm(
                  'threshold',
                  formatNumber(newPrice + newPrice * 0.01, {
                    compactInteger: false,
                    decimalLength: 1,
                    minifyDecimalRepeats: false,
                    seperateByComma: false,
                  }) as never,
                );
              }
            }}
          />
        )}
      </>

      <div className="mt-6 flex items-center justify-stretch gap-2">
        <Button
          variant="primary"
          className="grow"
          disabled={!form.threshold || +form.threshold < 0}
        >
          {t('common:actions.next')}
          <Icon name={bxRightArrowAlt} className="ms-2" />
        </Button>
      </div>
    </form>
  );
}
