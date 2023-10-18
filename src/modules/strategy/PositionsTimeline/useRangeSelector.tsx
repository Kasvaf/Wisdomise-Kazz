import dayjs from 'dayjs';
import { clsx } from 'clsx';
import { useCallback, useMemo, useState } from 'react';
import makeArray from 'utils/makeArray';

interface Segment {
  label: string;
  bold: boolean;
}

interface Range {
  label: string;
  start: Date;
  end: Date;
  segments: Segment[];
}

interface Props {
  options: string[];
  selected: string;
  onChange: (option: string) => void;
}

const RangeItem: React.FC<{
  option: string;
  isSelected: boolean;
  onChange: (rng: string) => void;
}> = ({ option, isSelected, onChange }) => {
  const clickHandler = useCallback(() => onChange(option), [onChange, option]);
  return (
    <div
      className={clsx(
        'flex items-center justify-center',
        'w-20 rounded-full py-1 text-sm text-white',
        isSelected
          ? 'bg-black/80'
          : 'cursor-pointer bg-white/10 hover:bg-white/20',
      )}
      onClick={clickHandler}
    >
      {option}
    </div>
  );
};

const RangeSelector: React.FC<Props> = ({ options, selected, onChange }) => (
  <div className="flex select-none gap-2">
    {options.map((opt, ind) => (
      <RangeItem
        key={ind}
        option={opt}
        isSelected={selected === opt}
        onChange={onChange}
      />
    ))}
  </div>
);

function makeRange({
  label,
  now,
  count,
  duration,
  labelFn,
  boldFn,
}: {
  label: string;
  now: Date;
  count: number;
  duration: number;
  labelFn: (d: dayjs.Dayjs, i: number, a: dayjs.Dayjs[]) => string;
  boldFn: (
    label: string,
    d: dayjs.Dayjs,
    i: number,
    a: dayjs.Dayjs[],
  ) => boolean;
}) {
  const period = duration / count;
  const offset = now.getTimezoneOffset() * 60 * 1000;
  const end = new Date(Math.ceil((+now + offset) / period) * period - offset);
  const start = new Date(+end - duration);
  const dates = makeArray(count).map(i => dayjs(+start + i * period));
  return {
    label,
    start,
    end,
    segments: dates // each 10 minute
      .map((d, i, a) => {
        const label = labelFn(d, i, a);
        return {
          label,
          bold: boldFn(label, d, i, a),
        };
      }),
  };
}

export interface Ranger {
  range: Range;
  element: JSX.Element;
}

export default function useRangeSelector(): Ranger {
  const options: Range[] = useMemo(() => {
    const now = new Date();
    return [
      makeRange({
        label: '4h',
        now,
        count: 24,
        duration: 4 * 60 * 60 * 1000,
        labelFn: (d, i, a) =>
          d.format(
            !i || d.date() !== a[i - 1].date() ? 'D MMM\nH:mm' : '\nH:mm',
          ),
        boldFn: l => l.endsWith(':00'),
      }),
      makeRange({
        label: '24h',
        now,
        count: 24,
        duration: 24 * 60 * 60 * 1000,
        labelFn: (d, i, a) =>
          d.format(
            !i || d.date() !== a[i - 1].date() ? 'D MMM\nH:mm' : '\nH:mm',
          ),
        boldFn: (l, d) => d.hour() % 6 === 0,
      }),
      makeRange({
        label: '7d',
        now,
        count: 7,
        duration: 7 * 24 * 60 * 60 * 1000,
        labelFn: (d, i, a) =>
          d.format(
            !i || d.year() !== a[i - 1].year() ? 'YYYY\nDD MMM' : '\nDD MMM',
          ),
        boldFn: () => false,
      }),
      makeRange({
        label: '30d',
        now,
        count: 30,
        duration: 30 * 24 * 60 * 60 * 1000,
        labelFn: (d, i, a) =>
          d.format(
            !i || d.year() !== a[i - 1].year() || d.month() !== a[i - 1].month()
              ? 'YYYY\nMMM\nDD'
              : '\nDD',
          ),
        boldFn: (l, d) => d.day() === 1,
      }),
    ];
  }, []);

  const [selected, setSelected] = useState('30d');
  const Component = (
    <RangeSelector
      options={options.map(x => x.label)}
      selected={selected}
      onChange={setSelected}
    />
  );
  const selectedRange = options.find(x => x.label === selected);
  if (!selectedRange) throw new Error('unexpected');
  return { range: selectedRange, element: Component };
}
