import { clsx } from 'clsx';
import { Select } from 'antd';
import { bxChevronDown } from 'boxicons-quasar';
import Icon from 'shared/Icon';
import { useIsPairSupported } from 'api';
const { Option } = Select;

type Quotes = 'tether' | 'the-open-network';
const QuoteSelector: React.FC<{
  baseSlug: string;
  value: Quotes;
  onChange?: (newValue: Quotes) => any;
  disabled?: boolean;
}> = ({ baseSlug, value, onChange, disabled }) => {
  const isSupported = useIsPairSupported(baseSlug);

  return (
    <Select
      value={value}
      onChange={onChange}
      className={clsx('bg-transparent', disabled && 'opacity-30')}
      suffixIcon={<Icon name={bxChevronDown} className="mr-2 text-white" />}
      disabled={disabled}
    >
      {isSupported('tether') && <Option value="tether">USDT</Option>}
      {isSupported('the-open-network') && (
        <Option value="the-open-network">TON</Option>
      )}
    </Select>
  );
};

export default QuoteSelector;
