import { Select, type SelectProps } from 'antd';
import { useMemo, useState, type FC } from 'react';
import { clsx } from 'clsx';
import { useDebounce } from 'usehooks-ts';
import { bxChevronDown } from 'boxicons-quasar';
import { useCoins, useCoinDetails, useLastPriceQuery } from 'api';
import type { Coin as CoinType, PricesExchange } from 'api/types/shared';
import { DirectionalNumber } from 'shared/DirectionalNumber';
import { ReadableNumber } from 'shared/ReadableNumber';
import { Coin } from 'shared/Coin';
import Spin from 'shared/Spin';
import Icon from 'shared/Icon';

export const CoinSelect: FC<
  SelectProps<string> & {
    filterTokens?: (item: string) => boolean;
    priceExchange?: PricesExchange | 'auto';
    emptyOption?: string;
    mini?: boolean;
    tradableCoinsOnly?: boolean;
  }
> = ({
  value,
  className,
  disabled,
  filterTokens,
  priceExchange,
  emptyOption,
  mini = true,
  tradableCoinsOnly,
  ...props
}) => {
  const [query, setQuery] = useState('');
  const q = useDebounce(query, 400);
  const coinList = useCoins({ query: q, tradableCoinsOnly });

  const coin = useCoinDetails({ slug: value ?? 'tether' });
  const { data: lastPrice } = useLastPriceQuery({
    slug: value == null ? undefined : value,
    exchange: priceExchange === 'auto' ? undefined : priceExchange,
  });

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

  const allOptions = useMemo(
    () => [
      ...(emptyOption
        ? [
            {
              label: emptyOption,
              value: '',
            },
          ]
        : []),
      ...coins
        .filter(x => (filterTokens ? filterTokens(x.slug ?? '') : true))
        .map(c => ({
          label: (
            <Coin coin={c} nonLink mini={mini} className="!p-0 align-middle" />
          ),
          value: c.slug,
        })),
    ],
    [coins, emptyOption, filterTokens, mini],
  );

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
      suffixIcon={
        priceExchange ? (
          <div className="flex items-center gap-2">
            {lastPrice && coin.data?.data?.price_change_percentage_24h && (
              <div className="flex flex-col items-end gap-1">
                <ReadableNumber
                  className="text-[0.75rem] text-white"
                  value={lastPrice}
                />
                <DirectionalNumber
                  value={coin.data?.data?.price_change_percentage_24h}
                  showSign
                  className="text-[0.625rem]"
                  label="%"
                />
              </div>
            )}

            <Icon name={bxChevronDown} />
          </div>
        ) : undefined
      }
      options={allOptions}
      {...props}
    />
  );
};
