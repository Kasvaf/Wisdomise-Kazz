import { clsx } from 'clsx';
import { Select } from 'antd';
import { bxChevronDown } from 'boxicons-quasar';
import { useEffect } from 'react';
import Icon from 'shared/Icon';
import { useSupportedPairs } from 'api';
import { type AutoTraderSupportedQuotes } from 'api/ton';
const { Option } = Select;

const QuoteSelector: React.FC<{
  baseSlug: string;
  value: AutoTraderSupportedQuotes;
  onChange?: (newValue: AutoTraderSupportedQuotes) => any;
  disabled?: boolean;
}> = ({ baseSlug, value, onChange, disabled }) => {
  const { data } = useSupportedPairs(baseSlug);

  const firstSupported = data?.[0]?.quote?.slug;
  const isValueSupported = data?.some(x => x.quote.slug === value);
  useEffect(() => {
    if (firstSupported && !isValueSupported) {
      setTimeout(() => {
        onChange?.(firstSupported as any);
      }, 5);
    }
  }, [firstSupported, isValueSupported, onChange]);

  return (
    <Select
      value={value}
      onChange={onChange}
      className={clsx('bg-transparent', disabled && 'opacity-30')}
      suffixIcon={<Icon name={bxChevronDown} className="mr-2 text-white" />}
      disabled={disabled}
    >
      {data?.map(({ quote }) => (
        <Option key={quote.slug} value={quote.slug}>
          {quote.abbreviation}
        </Option>
      ))}
    </Select>
  );
};

export default QuoteSelector;
