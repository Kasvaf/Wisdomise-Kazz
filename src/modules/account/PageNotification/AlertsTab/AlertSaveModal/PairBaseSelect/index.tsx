import { Select, type SelectProps } from 'antd';
import { useMemo, useState, type FC } from 'react';
import { clsx } from 'clsx';
import { useCoinList, useCoinOverview } from 'api';
import { Coin } from 'shared/Coin';
import type { Coin as CoinType } from 'api/types/shared';

export const PairBaseSelect: FC<SelectProps<string>> = ({
  value,
  className,
  disabled,
  ...props
}) => {
  const [query, setQuery] = useState('');
  const coinList = useCoinList({ q: query || 'bitcoin' });
  const coin = useCoinOverview({ slug: value ?? 'bitcoin' });

  const coins = useMemo<CoinType[]>(() => {
    const selectedCoin = coin.data?.symbol;
    const list = coinList.data ?? [];
    return [
      ...(selectedCoin ? [selectedCoin] : []),
      ...list.filter(x => x.slug !== selectedCoin?.slug),
    ];
  }, [coinList, coin]);

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
