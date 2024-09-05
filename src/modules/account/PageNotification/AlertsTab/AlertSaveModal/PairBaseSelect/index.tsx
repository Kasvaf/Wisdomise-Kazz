import { Select, type SelectProps } from 'antd';
import { useMemo, type FC } from 'react';
import { clsx } from 'clsx';
import { useCoinSignals } from 'api';
import { Coin } from 'shared/Coin';
import type { Coin as CoinType } from 'api/types/shared';

export const PairBaseSelect: FC<SelectProps<string>> = ({
  value,
  className,
  disabled,
  ...props
}) => {
  const signals = useCoinSignals();
  const coins = useMemo<CoinType[]>(() => {
    const shouldInjectValue =
      value && !signals?.data?.some(coin => coin.symbol.slug === value);
    return [
      ...(shouldInjectValue
        ? [
            {
              abbreviation: value,
              name: value,
              slug: value,
            } satisfies CoinType,
          ]
        : []),
      ...(signals?.data || []).map(coin => coin.symbol).filter(x => !!x.slug),
    ];
  }, [signals, value]);

  return (
    <Select
      className={clsx('[&_.ant-select-selector]:!bg-black/20', className)}
      value={value}
      showSearch
      autoClearSearchValue
      showArrow={!disabled}
      disabled={disabled}
      filterOption={(input, option) => {
        return JSON.stringify(
          coins.find(x => x.slug === option?.value) ?? {},
        ).includes(input.toLowerCase());
      }}
      options={coins.map(coin => ({
        label: <Coin coin={coin} nonLink mini className="align-middle" />,
        value: coin.slug,
      }))}
      {...props}
    />
  );
};
