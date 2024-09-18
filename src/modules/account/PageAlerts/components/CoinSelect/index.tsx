import { Select, type SelectProps } from 'antd';
import { useMemo, useState, type FC } from 'react';
import { clsx } from 'clsx';
import { useDebounce } from 'usehooks-ts';
import { useCoinList, useCoinOverview } from 'api';
import { Coin } from 'shared/Coin';
import type { Coin as CoinType } from 'api/types/shared';
import Spin from 'shared/Spin';

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
      ...(selectedCoin && !query && list.findIndex(x => x.slug !== value) === -1
        ? [selectedCoin]
        : []),
      ...list.filter(x => x.slug),
    ];
  }, [value, coin.data, coinList.data, query]);

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
      filterOption={false}
      loading={coinList.isLoading}
      popupMatchSelectWidth={false}
      notFoundContent={
        coinList.isLoading ? (
          <div className="animate-pulse px-1 py-8 text-center text-xxs text-v1-content-primary">
            <Spin />
          </div>
        ) : undefined
      }
      options={
        coins.map(coin => ({
          label: (
            <Coin coin={coin} nonLink mini className="!p-0 align-middle" />
          ),
          value: coin.slug,
        })) ?? []
      }
      {...props}
    />
  );
};
