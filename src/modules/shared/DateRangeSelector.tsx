import { clsx } from 'clsx';
import { DatePicker } from 'antd';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;

interface Props {
  label?: string;
  placeholder?: [string, string];
  value?: [Date, Date];
  onChange: (item?: [Date, Date]) => void;
  disabled?: boolean;
  className?: string;
}

const DateRangeSelector: React.FC<Props> = ({
  label,
  placeholder,
  value,
  onChange,
  disabled,
  className,
}) => {
  const rangeSelectHandler = (
    val?: Array<{
      $D: number;
      $M: number;
      $y: number;
    }> | null,
  ) => {
    if (val?.[0] && val[1]) {
      const [start, end] = val;
      onChange([
        new Date(start.$y, start.$M, start.$D, 0, 0, 0, 0),
        new Date(end.$y, end.$M, end.$D, 23, 59, 59, 999),
      ]);
    } else {
      onChange(undefined);
    }
  };

  return (
    <div className={clsx('flex flex-col', className)}>
      {label && <label className="mb-2 ml-4 block">{label}</label>}
      <RangePicker
        className="h-12"
        onChange={rangeSelectHandler as any}
        value={value && [dayjs(value[0]), dayjs(value[1])]}
        disabled={disabled}
        placeholder={placeholder}
      />
    </div>
  );
};

export default DateRangeSelector;
