import { Trans } from 'react-i18next';
import { clsx } from 'clsx';
import { type Alert, type AlertDataSource } from 'api/alert';
import { ReadableNumber } from 'shared/ReadableNumber';
import { CoinSelect } from '../CoinSelect';
import { OperatorSelect } from '../OperatorSelect';
import { ExchangeSelect } from '../ExchangeSelect';

export function AlertTarget<D extends AlertDataSource>({
  value,
  className,
}: {
  value: Alert<D>;
  className?: string;
}) {
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
              <CoinSelect value={value.params.base} disabled size="small" />
            ),
            Quote: (
              <CoinSelect value={value.params.quote} disabled size="small" />
            ),
            Operator: (
              <OperatorSelect
                value={value.condition?.operator as string}
                disabled
                showEqual
                size="small"
              />
            ),
            Threshold: <ReadableNumber value={+value.condition?.threshold} />,
            Exchange:
              value.params?.market_name && value.params?.market_type ? (
                <ExchangeSelect
                  value={value.params.market_name}
                  marketType={value.params.market_type}
                  disabled
                  size="small"
                />
              ) : (
                <span />
              ),
          }}
        />
      )}
    </div>
  );
}
