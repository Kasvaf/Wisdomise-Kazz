import { Select } from 'antd';
import { useEffect, useState } from 'react';
import TextBox from 'shared/TextBox';
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

const DurationInput: React.FC<Props> = ({ onChange, value, ...props }) => {
  const [numeric, setNumeric] = useState(Number.parseInt(value));
  const [unit, setUnit] = useState(value.replace(/^\d+/, ''));

  const selectAfter = (
    <Select value={unit} onChange={setUnit} className="bg-transparent">
      <Option value="s">Second</Option>
      <Option value="m">Minute</Option>
      <Option value="h">Hour</Option>
      <Option value="d">Day</Option>
      <Option value="M">Month</Option>
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
