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
          'text-v1-background-positive',
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
  const { t } = useTranslation('coin-radar');
  return (
    <ButtonSelect
      size="md"
      options={[
        {
          label: (
            <Label
              label={t('social-radar.sorts.rank')}
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
              label={t('social-radar.sorts.call_time')}
              value="call_time"
              sortBy={sortBy}
              sortOrder={sortOrder}
            />
          ),
          value: 'call_time',
        },
        {
          label: (
            <Label
              label={t('social-radar.sorts.price_change')}
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
              label={t('social-radar.sorts.pnl')}
              value="pnl"
              sortBy={sortBy}
              sortOrder={sortOrder}
            />
          ),
          value: 'pnl',
        },
        {
          label: (
            <Label
              label={t('social-radar.sorts.market_cap')}
              value="market_cap"
              sortBy={sortBy}
              sortOrder={sortOrder}
            />
          ),
          value: 'market_cap',
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
