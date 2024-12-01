import { Select } from 'antd';
import { useMemo, useState } from 'react';
import { clsx } from 'clsx';
import { useDebounce } from 'usehooks-ts';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation('common');
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
      notFoundContent={
        coinList.isLoading ? (
          <div className="min-h-10 animate-pulse p-4 text-center">
            {t('almost-there')}
          </div>
        ) : undefined
      }
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
