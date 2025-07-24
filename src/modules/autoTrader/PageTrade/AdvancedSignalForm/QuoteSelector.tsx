import { clsx } from 'clsx';
import { useEffect, useState } from 'react';
import { useSupportedPairs } from 'api';
import { useAccountBalance } from 'api/chains';
import { Select } from 'shared/v1-components/Select';

const isDollar = (x: string) => x === 'tether' || x === 'usd-coin';
const BalanceHandler: React.FC<{
  quote: string;
  networks: string[];
  onBalance: (balance: number) => void;
}> = ({ quote, networks, onBalance }) => {
  const { data, isLoading } = useAccountBalance(
    quote,
    networks.includes('solana')
      ? 'solana'
      : networks.includes('the-open-network')
      ? 'the-open-network'
      : null,
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
  value: string;
  onChange?: (newValue: string) => any;
  disabled?: boolean;
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'xl';
}> = ({ baseSlug, value, onChange, disabled, className, size = 'md' }) => {
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
        data?.map(({ quote, network_slugs: networks }) => (
          <BalanceHandler
            key={quote.slug}
            quote={quote.slug}
            networks={networks}
            onBalance={b => {
              setSeen(x => x + 1);
              if (
                b > bestQuoteBalance &&
                (!bestQuoteBalance || !isDollar(value) || isDollar(quote.slug))
              ) {
                setBestQuoteBalance(b);
                onChange?.(quote.slug);
              }
            }}
          />
        ))}

      {data && (
        <Select
          options={data?.map(p => p.quote.slug)}
          value={value}
          onChange={newValue => {
            if (newValue) {
              setIsManualSelected(true);
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
      )}
    </>
  );
};

export default QuoteSelector;
