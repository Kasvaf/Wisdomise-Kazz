import { Select, type SelectProps } from 'antd';
import { useMemo, useState, type FC } from 'react';
import { clsx } from 'clsx';
import { useDebounce } from 'usehooks-ts';
import { useCoinList, useCoinOverview } from 'api';
import { Coin } from 'shared/Coin';
import type { Coin as CoinType } from 'api/types/shared';

export const CoinSelect: FC<SelectProps<string>> = ({
  value,
  className,
  disabled,
  ...props
}) => {
  const [query, setQuery] = useState('');
  const q = useDebounce(query, 400);
  const coinList = useCoinList({ q });

  const coin = useCoinOverview({ slug: value ?? 'tether' });

  const coins = useMemo<CoinType[]>(() => {
    const selectedCoin = value ? coin.data?.symbol : undefined;
    const list = coinList.data ?? [];
    return [
      ...(selectedCoin ? [selectedCoin] : []),
      ...list.filter(x => x.slug !== selectedCoin?.slug),
    ];
  }, [value, coin.data, coinList.data]);

  return (
    <Select
      className={clsx('[&_.ant-select-selector]:!bg-black/20', className)}
      value={value}
      showSearch
      autoClearSearchValue
      showArrow={!disabled}
      disabled={disabled}
      searchValue={query}
      onSearch={setQuery}
      loading={coinList.isLoading}
      options={
        coins.map(coin => ({
          label: <Coin coin={coin} nonLink mini className="align-middle" />,
          value: coin.slug,
        })) ?? []
      }
      {...props}
    />
  );
};
