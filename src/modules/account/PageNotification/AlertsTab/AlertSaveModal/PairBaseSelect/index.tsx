import { Select, type SelectProps } from 'antd';
import { useMemo, type FC } from 'react';
import { clsx } from 'clsx';
import { type CoinSignal, useCoinSignals } from 'api';
import { cdnCoinIcon } from 'shared/CoinsIcons';

const coinIcon = (symbolOrObject: string | CoinSignal) => {
  if (!symbolOrObject) return '';
  if (typeof symbolOrObject === 'string') return cdnCoinIcon(symbolOrObject);
  return symbolOrObject.image ?? cdnCoinIcon(symbolOrObject.symbol_name);
};

export const PairBaseSelect: FC<SelectProps<string>> = ({
  value,
  className,
  disabled,
  ...props
}) => {
  const signals = useCoinSignals();
  const coins = useMemo(
    () => [
      ...(value &&
      signals?.data?.findIndex(coin => coin.symbol_name === value) === -1
        ? [
            {
              symbol: value,
              icon: coinIcon(value),
            },
          ]
        : []),
      ...(signals?.data || []).map(coin => ({
        symbol: coin.symbol_name,
        icon: coinIcon(coin),
      })),
    ],
    [signals, value],
  );

  return (
    <Select
      className={clsx('[&_.ant-select-selector]:!bg-black/20', className)}
      value={value}
      showSearch
      autoClearSearchValue
      showArrow={!disabled}
      disabled={disabled}
      filterOption={(input, option) =>
        coins
          .find(x => x.symbol === option?.value)
          ?.symbol.toLowerCase()
          .includes(input.toLowerCase()) || false
      }
      options={coins.map(coin => ({
        label: (
          <>
            <img
              src={coin.icon}
              alt={coin.symbol}
              className="me-2 inline-block size-4 rounded-full bg-white"
            />
            {coin.symbol}
          </>
        ),
        value: coin.symbol,
      }))}
      {...props}
    />
  );
};
