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
  return (
    <ButtonSelect
      options={[
        {
          label: 'Wise Logic',
          value: 'rank',
        },
        {
          label: 'Newest',
          value: 'call_time',
        },
        {
          label: '24H Chg',
          value: 'price_change',
        },
        {
          label: 'PNL',
          value: 'pnl',
        },
        {
          label: 'Market Cap',
          value: 'market_cap',
        },
      ]}
      value={value ?? 'rank'}
      onChange={onChange}
      className={className}
    />
  );
}
