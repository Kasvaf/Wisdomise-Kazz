import { Trans, useTranslation } from 'react-i18next';
import { clsx } from 'clsx';
import { type Alert } from 'api/alert';
import { ReadableNumber } from 'shared/ReadableNumber';
import { useAlertForm } from '../forms';
import { CoinSelect } from './CoinSelect';
import { OperatorSelect } from './OperatorSelect';

export function AlertTarget({
  value,
  className,
}: {
  value: Alert;
  className?: string;
}) {
  const { t } = useTranslation('alerts');
  const alertForm = useAlertForm(value);
  if (!alertForm) return null;
  return (
    <div
      className={clsx(
        '[&_.ant-select-selector]:!bg-transparent [&_.ant-select-selector]:!p-0',
        '[&_svg]:!size-4',
        className,
      )}
    >
      {alertForm.value === 'price' && (
        <Trans
          i18nKey="types.price.sentence"
          ns="alerts"
          components={{
            Br: <i />,
            Badge: <span />,
            Base: (
              <CoinSelect
                value={
                  value.params.find(x => x.field_name === 'base')
                    ?.value as string
                }
                disabled
                size="small"
              />
            ),
            Quote: (
              <CoinSelect
                value={
                  value.params.find(x => x.field_name === 'quote')
                    ?.value as string
                }
                disabled
                size="small"
              />
            ),
            Operator: (
              <OperatorSelect
                value={value.conditions?.[0].operator}
                disabled
                showEqual
                size="small"
              />
            ),
            Threshold: (
              <ReadableNumber
                value={+value.conditions?.[0]?.threshold}
                format={{
                  compactInteger: false,
                  decimalLength: -1,
                  minifyDecimalRepeats: false,
                  seperateByComma: true,
                }}
              />
            ),
          }}
        />
      )}
      {alertForm.value === 'report' && t('types.report.sentence')}
      {alertForm.value === 'screener' &&
        value.data_source === 'social_radar' &&
        t('types.screener.types.social_radar.sentence')}
      {alertForm.value === 'screener' &&
        value.data_source === 'technical_radar' &&
        t('types.screener.types.technical_radar.sentence')}
    </div>
  );
}
