import { clsx } from 'clsx';
import { Select } from 'antd';
import { bxChevronDown } from 'boxicons-quasar';
import Icon from 'shared/Icon';
const { Option } = Select;

type Quotes = 'tether' | 'the-open-network';
const QuoteSelector: React.FC<{
  value: Quotes;
  onChange?: (newValue: Quotes) => any;
  disabled?: boolean;
}> = ({ value, onChange, disabled }) => {
  return (
    <Select
      value={value}
      onChange={onChange}
      className={clsx('bg-transparent', disabled && 'opacity-30')}
      suffixIcon={<Icon name={bxChevronDown} className="mr-2 text-white" />}
      disabled={disabled}
    >
      <Option value="tether">USDT</Option>
      <Option value="the-open-network">TON</Option>
    </Select>
  );
};

export default QuoteSelector;
