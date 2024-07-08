import { clsx } from 'clsx';
import { Select } from 'antd';
import { bxChevronDown } from 'boxicons-quasar';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import TextBox from 'shared/TextBox';
import Icon from 'shared/Icon';
const { Option } = Select;

interface Props {
  label?: string | React.ReactNode;
  hint?: string | React.ReactNode;
  value: string;
  disabled?: boolean;
  className?: string;
  placeholder?: string;
  inputClassName?: string;
  error?: string | boolean;
  onChange: (item: string) => void;
}

export function parseDur(dur: string) {
  const val = Number.parseInt(dur);
  const d = new Date();
  switch (dur.replace(/\d+/, '')) {
    case 's': {
      d.setSeconds(d.getSeconds() + val);
      break;
    }
    case 'm': {
      d.setMinutes(d.getMinutes() + val);
      break;
    }
    case 'h': {
      d.setHours(d.getHours() + val);
      break;
    }
    case 'd': {
      d.setDate(d.getDate() + val);
      break;
    }
    case 'M': {
      d.setMonth(d.getMonth() + val);
      break;
    }
  }
  return d.toISOString();
}

const DurationInput: React.FC<Props> = ({ onChange, value, ...props }) => {
  const { t } = useTranslation('builder');
  const [numeric, setNumeric] = useState(Number.parseInt(value));
  const [unit, setUnit] = useState(value.replace(/^\d+/, ''));

  const selectAfter = (
    <Select
      value={unit}
      onChange={setUnit}
      className={clsx('bg-transparent', props.disabled && 'opacity-30')}
      suffixIcon={<Icon name={bxChevronDown} className="mr-2 text-white" />}
      disabled={props.disabled}
    >
      <Option value="s">{t('duration.second')}</Option>
      <Option value="m">{t('duration.minute')}</Option>
      <Option value="h">{t('duration.hour')}</Option>
      <Option value="d">{t('duration.day')}</Option>
      <Option value="M">{t('duration.month')}</Option>
    </Select>
  );

  useEffect(() => {
    onChange(String(numeric) + unit);
  }, [numeric, onChange, unit, value]);

  return (
    <TextBox
      value={String(numeric)}
      onChange={v => setNumeric(Number.parseInt(v))}
      suffix={selectAfter}
      noSuffixPad
      onBlur={() => {
        if (unit === 's' && numeric < 30) {
          setNumeric(30);
        }
      }}
      {...props}
    />
  );
};

export default DurationInput;
