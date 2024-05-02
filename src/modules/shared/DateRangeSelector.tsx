import { clsx } from 'clsx';
import { DatePicker } from 'antd';
import dayjs from 'dayjs';
import { useEffect } from 'react';
import { type RangePickerProps } from 'antd/es/date-picker';

const { RangePicker } = DatePicker;

interface Props {
  label?: string;
  placeholder?: [string, string];
  value?: [Date, Date];
  onChange: (item?: [Date, Date]) => void;
  defaultRecent?: number;
  disabled?: boolean;
  className?: string;
}

const DateRangeSelector: React.FC<Props> = ({
  label,
  placeholder,
  value,
  onChange,
  defaultRecent,
  disabled,
  className,
}) => {
  const rangeSelectHandler: RangePickerProps['onChange'] = val => {
    if (val?.[0] && val[1]) {
      const [start, end] = val;
      onChange([
        new Date(start.year(), start.month(), start.date(), 0, 0, 0, 0),
        new Date(end.year(), end.month(), end.date(), 23, 59, 59, 999),
      ]);
    } else {
      onChange(undefined);
    }
  };

  useEffect(() => {
    if (defaultRecent && !value?.[0] && !value?.[1]) {
      const now = new Date();
      const y = now.getFullYear();
      const m = now.getMonth();
      const d = now.getDate();
      onChange([
        new Date(y, m, d - defaultRecent, 0, 0, 0, 0),
        new Date(y, m, d, 23, 59, 59, 999),
      ]);
    }
  }, [onChange, defaultRecent, value]);

  return (
    <div className={clsx('flex flex-col', className)}>
      {label && <label className="mb-2 ml-2 block">{label}</label>}
      <RangePicker
        className="h-12"
        onChange={rangeSelectHandler}
        value={value && [dayjs(value[0]), dayjs(value[1])]}
        disabled={disabled}
        placeholder={placeholder}
      />
    </div>
  );
};

export default DateRangeSelector;
