import { Select, type SelectProps } from 'antd';
import { bxChevronDown } from 'boxicons-quasar';
import { clsx } from 'clsx';
import { type FC, useMemo, useState } from 'react';
import { useLastPriceStream } from 'services/price';
import { useCoins, useTokenReview } from 'services/rest/discovery';
import type { Coin as CoinType } from 'services/rest/types/shared';
import { Coin } from 'shared/Coin';
import { DirectionalNumber } from 'shared/DirectionalNumber';
import Icon from 'shared/Icon';
import { ReadableNumber } from 'shared/ReadableNumber';
import Spin from 'shared/Spin';
import { useDebounce } from 'usehooks-ts';

export const CoinSelect: FC<
  SelectProps<string> & {
    filterTokens?: (item: string) => boolean;
    showPrice?: boolean;
    emptyOption?: string;
    mini?: boolean;
    tradableCoinsOnly?: boolean;
  }
> = ({
  value,
  className,
  disabled,
  filterTokens,
  showPrice,
  emptyOption,
  mini = true,
  tradableCoinsOnly,
  ...props
}) => {
  const [query, setQuery] = useState('');
  const q = useDebounce(query, 400);
  const coinList = useCoins({ query: q, tradableCoinsOnly });

  const coin = useTokenReview({ slug: value ?? undefined });
  const { data: lastPrice } = useLastPriceStream({
    slug: value == null ? undefined : value,
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
            <Coin
              className="!p-0 h-full align-middle"
              coin={c}
              mini={mini}
              nonLink
            />
          ),
          value: c.slug,
        })),
    ],
    [coins, emptyOption, filterTokens, mini],
  );

  return (
    <Select
      autoClearSearchValue
      className={clsx('[&_.ant-select-selector]:!bg-black/20', className)}
      disabled={disabled}
      filterOption={false}
      loading={coinList.isLoading}
      notFoundContent={
        coinList.isLoading ? (
          <div className="animate-pulse px-1 py-8 text-center text-2xs text-v1-content-primary">
            <Spin />
          </div>
        ) : undefined
      }
      onSearch={setQuery}
      options={allOptions}
      popupMatchSelectWidth={false}
      searchValue={query}
      showArrow={!disabled}
      showSearch
      suffixIcon={
        showPrice ? (
          <div className="flex items-center gap-2">
            {lastPrice && coin.data?.data?.price_change_percentage_24h && (
              <div className="flex flex-col items-end gap-1">
                <ReadableNumber
                  className="text-[0.75rem] text-white"
                  value={lastPrice}
                />
                <DirectionalNumber
                  className="text-[0.625rem]"
                  label="%"
                  showSign
                  value={coin.data?.data?.price_change_percentage_24h}
                />
              </div>
            )}

            <Icon name={bxChevronDown} />
          </div>
        ) : undefined
      }
      value={value}
      {...props}
    />
  );
};
