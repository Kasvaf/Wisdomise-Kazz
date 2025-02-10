import { bxsUpArrow } from 'boxicons-quasar';
import { clsx } from 'clsx';
import { type FC } from 'react';
import { useTranslation } from 'react-i18next';
import Icon from 'shared/Icon';
import { ButtonSelect } from 'shared/v1-components/ButtonSelect';

const Label: FC<{
  sortBy: string;
  sortOrder: string;
  value: string;
  label: string;
}> = ({ sortBy, sortOrder, value, label }) => (
  <span className="inline-flex items-center gap-1">
    {label}
    {value === sortBy ? (
      <Icon
        name={bxsUpArrow}
        className={clsx(
          sortOrder !== 'ascending' && 'rotate-180',
          sortOrder === 'ascending'
            ? 'text-v1-background-positive'
            : 'text-v1-background-negative',
        )}
        size={10}
      />
    ) : null}
  </span>
);

export function SortModes({
  className,
  sortBy,
  sortOrder,
  onChange,
}: {
  className?: string;
  sortBy: string;
  sortOrder: string;
  onChange?: (sortBy: string, sortOrder: string) => void;
}) {
  const { t } = useTranslation('whale');
  return (
    <ButtonSelect
      size="md"
      options={[
        {
          label: (
            <Label
              label={t('top_coins.sorts.rank')}
              value="rank"
              sortBy={sortBy}
              sortOrder={sortOrder}
            />
          ),
          value: 'rank',
        },
        {
          label: (
            <Label
              label={t('top_coins.sorts.price_change')}
              value="price_change"
              sortBy={sortBy}
              sortOrder={sortOrder}
            />
          ),
          value: 'price_change',
        },
        {
          label: (
            <Label
              label={t('top_coins.sorts.market_cap')}
              value="market_cap"
              sortBy={sortBy}
              sortOrder={sortOrder}
            />
          ),
          value: 'market_cap',
        },
        {
          label: (
            <Label
              label={t('top_coins.sorts.buy')}
              value="buy"
              sortBy={sortBy}
              sortOrder={sortOrder}
            />
          ),
          value: 'buy',
        },
        {
          label: (
            <Label
              label={t('top_coins.sorts.sell')}
              value="sell"
              sortBy={sortBy}
              sortOrder={sortOrder}
            />
          ),
          value: 'sell',
        },
        {
          label: (
            <Label
              label={t('top_coins.sorts.transfer')}
              value="transfer"
              sortBy={sortBy}
              sortOrder={sortOrder}
            />
          ),
          value: 'transfer',
        },
        {
          label: (
            <Label
              label={t('top_coins.sorts.wallet_count')}
              value="wallet_count"
              sortBy={sortBy}
              sortOrder={sortOrder}
            />
          ),
          value: 'wallet_count',
        },
      ]}
      value={sortBy ?? 'rank'}
      onChange={newSortBy => {
        onChange?.(
          newSortBy,
          newSortBy === sortBy
            ? sortOrder === 'ascending'
              ? 'descending'
              : 'ascending'
            : 'ascending',
        );
      }}
      className={className}
    />
  );
}
