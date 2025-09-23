import { useTokenPairsQuery } from 'api';
import { clsx } from 'clsx';
import { Select } from 'shared/v1-components/Select';

const QuoteSelector: React.FC<{
  baseSlug: string;
  value: string;
  onChange?: (newValue: string) => any;
  disabled?: boolean;
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'xl';
}> = ({ baseSlug, value, onChange, disabled, className, size = 'md' }) => {
  const { data } = useTokenPairsQuery(baseSlug);

  return data ? (
    <Select
      className={clsx('!bg-transparent', className)}
      dialogClassName="w-20"
      disabled={disabled || !data?.length || data.length <= 1}
      onChange={newValue => {
        if (newValue) {
          onChange?.(newValue);
        }
      }}
      options={data?.map(p => p.quote.slug)}
      render={value => {
        return data?.find(p => p.quote.slug === value)?.quote?.abbreviation;
      }}
      size={size}
      value={value}
    />
  ) : null;
};

export default QuoteSelector;
