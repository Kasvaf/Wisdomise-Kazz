import { type ComponentProps, useMemo, useState } from 'react';
import { useDebounce } from 'usehooks-ts';
import { clsx } from 'clsx';
import { useCoins, useCoinDetails } from 'api';
import type { Coin as CoinType } from 'api/types/shared';
import { CoinLogo } from 'shared/Coin';
import { Select } from 'shared/v1-components/Select';

type CoinListHook = (params: { query: string }) => {
  data?: CoinType[];
  isLoading: boolean;
};

interface CoinSelectProps
  extends Omit<
    ComponentProps<typeof Select<string, false>>,
    | 'render'
    | 'onSearch'
    | 'options'
    | 'loading'
    | 'showSearch'
    | 'searchValue'
    | 'multiple'
  > {
  useCoinList?: CoinListHook;
  noSearch?: boolean;
}

export function CoinSelect({
  size,
  value,
  noSearch,
  useCoinList = useCoins,
  ...props
}: CoinSelectProps) {
  const [query, setQuery] = useState('');
  const q = useDebounce(query, 400);
  const coinList = useCoinList({ query: q });

  const coin = useCoinDetails({ slug: value });

  const coins = useMemo<CoinType[]>(() => {
    const coinObject = q
      ? undefined
      : value
      ? coin.data?.symbol ?? coinList.data?.find(x => x.slug !== value)
      : undefined;
    const list = coinList.data ?? [];
    return [...(coinObject ? [coinObject] : []), ...list];
  }, [q, value, coin.data?.symbol, coinList.data]);

  return (
    <Select
      {...props}
      multiple={false}
      showSearch={noSearch !== false}
      searchValue={query}
      onSearch={setQuery}
      loading={coinList.isLoading || coin.isLoading}
      options={coins.map(x => x.slug)}
      value={value}
      size={size}
      render={val => {
        const currentCoin = coins.find(x => x.slug === val);
        if (!currentCoin) return val;
        return (
          <div className="flex items-center gap-2">
            <CoinLogo
              coin={currentCoin}
              className={clsx(
                size === 'xs' || size === 'sm' ? 'size-5' : 'size-7',
              )}
            />
            <div className="leading-tight">
              {size !== 'xs' && size !== 'sm' && <p>{currentCoin.name}</p>}
              <p className="text-xxs">{currentCoin.abbreviation}</p>
            </div>
          </div>
        );
      }}
    />
  );
}
