import { clsx } from 'clsx';
import { useSupportedPairs } from 'api';
import { Select } from 'shared/v1-components/Select';

const QuoteSelector: React.FC<{
  baseSlug: string;
  value: string;
  onChange?: (newValue: string) => any;
  disabled?: boolean;
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'xl';
}> = ({ baseSlug, value, onChange, disabled, className, size = 'md' }) => {
  const { data } = useSupportedPairs(baseSlug);

  return data ? (
    <Select
      options={data?.map(p => p.quote.slug)}
      value={value}
      onChange={newValue => {
        if (newValue) {
          onChange?.(newValue);
        }
      }}
      size={size}
      dialogClassName="w-20"
      className={clsx('!bg-transparent', className)}
      disabled={disabled || !data?.length || data.length <= 1}
      render={value => {
        return data?.find(p => p.quote.slug === value)?.quote?.abbreviation;
      }}
    />
  ) : null;
};

export default QuoteSelector;
