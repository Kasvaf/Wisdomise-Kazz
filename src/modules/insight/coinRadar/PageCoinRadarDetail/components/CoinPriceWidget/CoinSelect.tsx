import { useMemo, useState } from 'react';
import { useDebounce } from 'usehooks-ts';
import { useCoinList, useCoinOverview } from 'api';
import type { Coin as CoinType } from 'api/types/shared';
import { Coin } from 'shared/Coin';
import { Select } from 'shared/v1-components/Select';

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
    const coinObject = q
      ? undefined
      : value
      ? coin.data?.symbol ?? coinList.data?.find(x => x.slug !== value)
      : undefined;
    const list = coinList.data ?? [];
    return [
      ...(coinObject ? [coinObject] : []),
      ...list.filter(x => x.slug && x.slug !== coinObject?.slug),
    ];
  }, [q, value, coin.data?.symbol, coinList.data]);

  return (
    <Select
      className={className}
      value={value}
      allowClear={false}
      onChange={onChange as never}
      showSearch
      searchValue={query}
      onSearch={setQuery}
      loading={coinList.isLoading}
      options={coins.map(x => x.slug)}
      render={val => {
        const currentCoin = coins.find(x => x.slug === val);
        if (!currentCoin) return '';
        return <Coin coin={currentCoin} nonLink imageClassName="size-8" />;
      }}
    />
  );
}
