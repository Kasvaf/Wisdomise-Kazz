import { Select, type SelectProps } from 'antd';
import { type FC } from 'react';
import { clsx } from 'clsx';
import { ReactComponent as DollarIcon } from './dollar.svg';

const FAKE_QUOTES = [
  {
    icon: DollarIcon,
    value: 'USDT',
    label: 'Dollars (USD)',
  },
];

export const PairQuoteSelect: FC<SelectProps<string>> = ({
  value,
  className,
  disabled,
  ...props
}) => {
  return (
    <Select
      className={clsx('[&_.ant-select-selector]:!bg-black/20', className)}
      showArrow={!disabled}
      disabled={disabled}
      value={value}
      filterOption={(input, option) => {
        const quote = FAKE_QUOTES.find(x => x.value === option?.value);
        return (
          quote?.label.toLowerCase().includes(input) ||
          quote?.value.toLowerCase().includes(input) ||
          false
        );
      }}
      options={FAKE_QUOTES.map(({ icon: Icon, label, value }) => ({
        label: (
          <>
            <Icon className="me-2 inline-block size-4" />
            {label}
          </>
        ),
        value,
      }))}
      {...props}
    />
  );
};
