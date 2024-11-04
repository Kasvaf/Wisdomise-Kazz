import { useTranslation } from 'react-i18next';
import { ButtonSelect } from 'shared/ButtonSelect';

export type SortMode =
  | 'rank'
  | 'call_time'
  | 'price_change'
  | 'pnl'
  | 'market_cap';

export function SortModes({
  className,
  value,
  onChange,
}: {
  className?: string;
  value?: SortMode;
  onChange?: (v?: SortMode) => void;
}) {
  const { t } = useTranslation('coin-radar');
  return (
    <ButtonSelect
      options={[
        {
          label: t('social-radar.sorts.rank'),
          value: 'rank',
        },
        {
          label: t('social-radar.sorts.call_time'),
          value: 'call_time',
        },
        {
          label: t('social-radar.sorts.price_change'),
          value: 'price_change',
        },
        {
          label: t('social-radar.sorts.pnl'),
          value: 'pnl',
        },
        {
          label: t('social-radar.sorts.market_cap'),
          value: 'market_cap',
        },
      ]}
      value={value ?? 'rank'}
      onChange={onChange}
      className={className}
    />
  );
}
