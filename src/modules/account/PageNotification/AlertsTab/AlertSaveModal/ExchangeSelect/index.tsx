import { Select, type SelectProps } from 'antd';
import { type FC } from 'react';
import { clsx } from 'clsx';
import { useMarketExchangesQuery } from 'api';
import { ReactComponent as BinanceIcon } from './binance.svg';
import { ReactComponent as CoinBaseIcon } from './coinbase.svg';

export const ExchangeSelect: FC<
  SelectProps<string> & {
    marketType: 'SPOT' | 'FUTURES';
  }
> = ({ marketType, className, disabled, ...props }) => {
  const { data } = useMarketExchangesQuery();
  const exchanges = (data || [])
    .filter(row => row.market_name === marketType)
    .map(row => ({
      ...row,
      iconComponent:
        row.exchange_name === 'BINANCE'
          ? BinanceIcon
          : row.exchange_name === 'COINBASE'
          ? CoinBaseIcon
          : null,
    }));

  return (
    <Select
      className={clsx('[&_.ant-select-selector]:!bg-black/20', className)}
      showArrow={!disabled}
      disabled={disabled}
      filterOption={(input, option) =>
        exchanges
          .find(x => x.exchange_name === option?.value)
          ?.exchange_name.toLowerCase()
          .includes(input.toLowerCase()) || false
      }
      options={exchanges.map(({ iconComponent: Icon, ...exchange }) => ({
        label: (
          <>
            {Icon && (
              <Icon className="me-2 inline-block size-4 rounded-full bg-white" />
            )}
            {exchange.exchange_name}{' '}
            <span className="ms-1 text-xxs opacity-60">
              ({exchange.market_name})
            </span>
          </>
        ),
        value: exchange.exchange_name,
        disabled: !exchange.is_active,
      }))}
      {...props}
    />
  );
};
