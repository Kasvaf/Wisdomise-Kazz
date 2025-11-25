import { clsx } from 'clsx';
import { Trans, useTranslation } from 'react-i18next';
import type { Alert } from 'services/rest/alert';
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
        '[&_.ant-select-selector]:!bg-transparent [&_.ant-select-selector]:!p-0 min-w-64',
        '[&_svg]:!size-4',
        className,
      )}
    >
      {alertForm.value === 'price' && (
        <Trans
          components={{
            Br: <i />,
            Badge: <span />,
            Base: (
              <CoinSelect
                disabled
                size="small"
                value={
                  value.params.find(x => x.field_name === 'base')
                    ?.value as string
                }
              />
            ),
            Quote: (
              <CoinSelect
                disabled
                size="small"
                value={
                  value.params.find(x => x.field_name === 'quote')
                    ?.value as string
                }
              />
            ),
            Operator: (
              <OperatorSelect
                disabled
                showEqual
                size="small"
                value={value.conditions?.[0].operator}
              />
            ),
            Threshold: (
              <ReadableNumber
                format={{
                  compactInteger: false,
                  decimalLength: -1,
                  minifyDecimalRepeats: false,
                  separateByComma: true,
                }}
                value={+value.conditions?.[0]?.threshold}
              />
            ),
          }}
          i18nKey="types.price.sentence"
          ns="alerts"
        />
      )}
      {alertForm.value === 'social_radar' &&
        t('types.social_radar_screener.subtitle')}
      {alertForm.value === 'technical_radar' &&
        t('types.technical_radar_screener.subtitle')}
      {alertForm.value === 'coin_radar' &&
        t('types.coin_radar_screener.subtitle')}
    </div>
  );
}
