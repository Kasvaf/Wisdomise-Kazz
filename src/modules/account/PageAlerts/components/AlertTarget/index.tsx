import { Trans, useTranslation } from 'react-i18next';
import { clsx } from 'clsx';
import { type Alert, type AlertDataSource } from 'api/alert';
import { ReadableNumber } from 'shared/ReadableNumber';
import { CoinSelect } from '../CoinSelect';
import { OperatorSelect } from '../OperatorSelect';

export function AlertTarget<D extends AlertDataSource>({
  value,
  className,
}: {
  value: Alert<D>;
  className?: string;
}) {
  const { t } = useTranslation('alerts');
  const valueAsMarketData = value as Alert<'market_data'>;
  return (
    <div
      className={clsx(
        '[&_.ant-select-selector]:!bg-transparent [&_.ant-select-selector]:!p-0',
        className,
      )}
    >
      {value.dataSource === 'market_data' && (
        <Trans
          i18nKey="forms.price.sentence"
          ns="alerts"
          components={{
            Br: <i />,
            Badge: <span />,
            Base: (
              <CoinSelect
                value={valueAsMarketData.params.base}
                disabled
                size="small"
              />
            ),
            Quote: (
              <CoinSelect
                value={valueAsMarketData.params.quote}
                disabled
                size="small"
              />
            ),
            Operator: (
              <OperatorSelect
                value={valueAsMarketData.condition?.operator as string}
                disabled
                showEqual
                size="small"
              />
            ),
            Threshold: (
              <ReadableNumber
                value={+valueAsMarketData.condition?.threshold}
                format={{
                  compactInteger: false,
                  decimalLength: -1,
                  minifyDecimalRepeats: false,
                  seperateByComma: true,
                }}
              />
            ),
            // Exchange:
            //   value.params?.market_name && value.params?.market_type ? (
            //     <ExchangeSelect
            //       value={value.params.market_name}
            //       marketType={value.params.market_type}
            //       disabled
            //       size="small"
            //     />
            //   ) : (
            //     <span />
            //   ),
          }}
        />
      )}
      {value.dataSource === 'custom:coin_radar_notification' && (
        <>{t('forms.coin-radar.sentence')}</>
      )}
    </div>
  );
}
