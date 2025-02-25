import { clsx } from 'clsx';
import { Select } from 'antd';
import { useEffect, useState } from 'react';
import { bxChevronDown } from 'boxicons-quasar';
import { useSupportedPairs } from 'api';
import { useAccountBalance, type AutoTraderSupportedQuotes } from 'api/chains';
import Icon from 'shared/Icon';
const { Option } = Select;

const isDollar = (x: string) => x === 'tether' || x === 'usd-coin';
const BalanceHandler: React.FC<{
  quote: string;
  onBalance: (balance: number) => void;
}> = ({ quote, onBalance }) => {
  const { data, isLoading } = useAccountBalance(
    quote as AutoTraderSupportedQuotes,
  );

  useEffect(() => {
    if (!isLoading && data != null) {
      onBalance(data);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, isLoading]);

  return null;
};

const QuoteSelector: React.FC<{
  baseSlug: string;
  value: AutoTraderSupportedQuotes;
  onChange?: (newValue: AutoTraderSupportedQuotes) => any;
  disabled?: boolean;
}> = ({ baseSlug, value, onChange, disabled }) => {
  const { data } = useSupportedPairs(baseSlug);

  const [isManualSelected, setIsManualSelected] = useState(disabled);
  const [bestQuoteBalance, setBestQuoteBalance] = useState(0);
  const [seen, setSeen] = useState(0);

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
    <>
      {!isManualSelected &&
        seen < Number(data?.length) &&
        data?.map(({ quote }) => (
          <BalanceHandler
            key={quote.slug}
            quote={quote.slug}
            onBalance={b => {
              setSeen(x => x + 1);
              if (
                b > bestQuoteBalance &&
                (!bestQuoteBalance || !isDollar(value) || isDollar(quote.slug))
              ) {
                setBestQuoteBalance(b);
                onChange?.(quote.slug as AutoTraderSupportedQuotes);
              }
            }}
          />
        ))}

      <Select
        value={value}
        onChange={newValue => {
          setIsManualSelected(true);
          onChange?.(newValue);
        }}
        className={clsx('bg-transparent', disabled && 'opacity-30')}
        suffixIcon={<Icon name={bxChevronDown} className="mr-2 text-white" />}
        disabled={disabled || !data?.length || data.length <= 1}
      >
        {data?.map(({ quote }) => (
          <Option key={quote.slug} value={quote.slug}>
            {quote.abbreviation}
          </Option>
        ))}
      </Select>
    </>
  );
};

export default QuoteSelector;
