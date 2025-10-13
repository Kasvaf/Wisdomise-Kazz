import { Spin } from 'antd';
import { useLastPriceStream } from 'api';
import { useTokenBalance } from 'api/chains';
import { WRAPPED_SOLANA_SLUG } from 'api/chains/constants';
import { useSymbolInfo } from 'api/symbol';
import { clsx } from 'clsx';
import { useActiveNetwork } from 'modules/base/active-network';
import { Coin } from 'shared/Coin';
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
  const { data: symbol } = useSymbolInfo({ slug });
  const { data: quoteSymbol } = useSymbolInfo({ slug: quote });

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
            <Coin className="-mr-2 ml-2" coin={symbol} mini nonLink noText />
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
                <Coin
                  className="-mr-2 ml-1"
                  coin={quoteSymbol}
                  mini
                  nonLink
                  noText
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
