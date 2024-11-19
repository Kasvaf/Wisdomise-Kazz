import { Select } from 'antd';
import { useMemo, useState } from 'react';
import { clsx } from 'clsx';
import { useDebounce } from 'usehooks-ts';
import { useCoinList, useCoinOverview } from 'api';
import type { Coin as CoinType } from 'api/types/shared';
import { Coin } from 'shared/Coin';

export function CoinSelect({
  value,
  className,
  onChange,
}: {
  value: string;
  onChange: (newValue: string) => void;
  className?: string;
}) {
  const [query, setQuery] = useState('');
  const q = useDebounce(query, 400);
  const coinList = useCoinList({ q });

  const coin = useCoinOverview({ slug: value });

  const coins = useMemo<CoinType[]>(() => {
    const coinObject = value
      ? coin.data?.symbol ?? coinList.data?.find(x => x.slug !== value)
      : undefined;
    const list = coinList.data ?? [];
    return [
      ...(coinObject ? [coinObject] : []),
      ...list.filter(x => x.slug && x.slug !== coinObject?.slug),
    ];
  }, [value, coin.data, coinList.data]);

  return (
    <Select
      className={clsx('[&_.ant-select-selector]:!bg-black/20', className)}
      value={value}
      showSearch
      autoClearSearchValue
      showArrow
      searchValue={query}
      onSearch={setQuery}
      filterOption={false}
      loading={coinList.isLoading}
      popupMatchSelectWidth={false}
      options={coins.map(c => ({
        label: (
          <Coin
            coin={c}
            nonLink
            className="!p-0 align-middle !text-sm"
            imageClassName="size-6"
            popup={false}
          />
        ),
        value: c.slug,
      }))}
      onChange={onChange}
    />
  );
}
