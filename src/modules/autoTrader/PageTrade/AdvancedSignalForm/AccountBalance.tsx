import { Spin } from 'antd';
import { clsx } from 'clsx';
import { useActiveNetwork } from 'modules/base/active-network';
import { useTokenBalance } from 'services/chains';
import { WRAPPED_SOLANA_SLUG } from 'services/chains/constants';
import { useLastPriceStream } from 'services/price';
import { useTokenInfo } from 'services/rest/token-info';
import { Token } from 'shared/v1-components/Token';
import { formatNumber } from 'utils/numbers';

export const AccountBalance: React.FC<{
  slug?: string;
  quote?: string;
  disabled?: boolean;
  setAmount?: (val: string) => void;
}> = ({ slug, disabled, setAmount, quote }) => {
  const net = useActiveNetwork();
  const { data: balance, isLoading } = useTokenBalance({
    slug,
    network: net,
  });
  const { data: priceByQuote } = useLastPriceStream({
    slug,
    quote,
    convertToUsd: false,
  });
  const { data: symbol } = useTokenInfo({ slug });
  const { data: quoteSymbol } = useTokenInfo({ slug: quote });

  const isNativeQuote =
    (net === 'the-open-network' && slug === 'the-open-network') ||
    (net === 'solana' && slug === WRAPPED_SOLANA_SLUG);

  return slug ? (
    isLoading ? (
      <div className="flex items-center gap-1 text-v1-content-secondary">
        <Spin size="small" />
        Reading Balance
      </div>
    ) : balance === null ? null : (
      <div
        className={clsx(
          'flex items-center gap-1 text-white/70',
          !disabled &&
            !isNativeQuote &&
            setAmount &&
            'cursor-pointer hover:text-white',
        )}
        onClick={e => {
          e.preventDefault();
          !disabled && !isNativeQuote && setAmount?.(String(balance));
        }}
      >
        <span className="flex items-center gap-2">
          {symbol && (
            <Token
              abbreviation={symbol.symbol}
              className="ml-2"
              icon
              link={false}
              logo={symbol.image_uri}
              name={symbol.name}
              size="xs"
            />
          )}
          {formatNumber(balance ?? 0, {
            decimalLength: 2,
            minifyDecimalRepeats: true,
            compactInteger: false,
            separateByComma: false,
          })}
        </span>
        {quote && (
          <>
            <div className="ml-1 size-1 rounded-full bg-v1-surface-l4" />
            <span className="flex items-center gap-2">
              {quoteSymbol && (
                <Token
                  className="ml-1"
                  icon
                  link={false}
                  logo={quoteSymbol.image_uri}
                  size="xs"
                />
              )}
              {formatNumber((priceByQuote ?? 0) * (balance ?? 0), {
                decimalLength: 2,
                minifyDecimalRepeats: true,
                compactInteger: false,
                separateByComma: false,
              })}
            </span>
          </>
        )}
      </div>
    )
  ) : null;
};
