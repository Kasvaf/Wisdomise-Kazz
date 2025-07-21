import { clsx } from 'clsx';
import { Spin } from 'antd';
import { useActiveNetwork } from 'modules/base/active-network';
import { useAccountBalance } from 'api/chains';
import { useSymbolInfo } from 'api/symbol';
import { Coin } from 'shared/Coin';

export const AccountBalance: React.FC<{
  slug?: string;
  disabled?: boolean;
  setAmount?: (val: string) => void;
}> = ({ slug, disabled, setAmount }) => {
  const net = useActiveNetwork();
  const { data: balance, isLoading } = useAccountBalance(slug, net);
  const { data: symbol } = useSymbolInfo(slug);
  const isNativeQuote =
    (net === 'the-open-network' && slug === 'the-open-network') ||
    (net === 'solana' && slug === 'wrapped-solana');

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
            <Coin coin={symbol} mini nonLink noText className="-mr-2 ml-2" />
          )}
          {String(balance)}
        </span>
      </div>
    )
  ) : null;
};
