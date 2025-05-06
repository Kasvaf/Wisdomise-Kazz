import { clsx } from 'clsx';
import { Spin } from 'antd';
import { ReactComponent as WalletIcon } from 'modules/base/wallet/wallet-icon.svg';
import { useAccountBalance } from 'api/chains';
import { useActiveNetwork } from 'modules/base/active-network';
import { useSymbolInfo } from 'api/symbol';

const AmountBalanceLabel: React.FC<{
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

  return (
    <div className="flex items-center justify-between text-xs">
      <span>Amount</span>
      {slug &&
        (isLoading ? (
          <div className="flex items-center gap-1 text-v1-content-secondary">
            <Spin />
            Reading Balance
          </div>
        ) : (
          balance != null && (
            <div
              className={clsx(
                'flex items-center gap-1 text-white/40',
                !disabled &&
                  !isNativeQuote &&
                  'cursor-pointer hover:text-white',
              )}
              onClick={() =>
                !disabled && !isNativeQuote && setAmount?.(String(balance))
              }
            >
              {balance ? (
                <>
                  <span className="flex items-center">
                    <WalletIcon className="mr-1" /> {String(balance)}{' '}
                    {symbol?.abbreviation}
                  </span>
                </>
              ) : (
                <span className="text-v1-content-negative">No Balance</span>
              )}
            </div>
          )
        ))}
    </div>
  );
};

export default AmountBalanceLabel;
