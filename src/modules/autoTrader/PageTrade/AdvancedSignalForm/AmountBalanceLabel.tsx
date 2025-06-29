import { clsx } from 'clsx';
import { Spin } from 'antd';
import { useAccountBalance } from 'api/chains';
import { useActiveNetwork } from 'modules/base/active-network';
import { useSymbolInfo } from 'api/symbol';
import { Coin } from 'shared/Coin';
import BtnSolanaWallets from 'modules/base/wallet/BtnSolanaWallets';

const AmountBalanceLabel: React.FC<{
  slug?: string;
  disabled?: boolean;
  setAmount?: (val: string) => void;
}> = ({ slug, disabled, setAmount }) => {
  return (
    <div className="flex items-center justify-between text-xs">
      <span>Amount</span>
      <div className="flex items-center justify-between">
        <BtnSolanaWallets className="mr-2 !h-auto !bg-transparent !p-0" />
        <AccountBalance slug={slug} disabled={disabled} setAmount={setAmount} />
      </div>
    </div>
  );
};

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
        <Spin />
        Reading Balance
      </div>
    ) : balance === null ? null : (
      <div
        className={clsx(
          'flex items-center gap-1 text-white/40',
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
        {balance ? (
          <>
            <span className="flex items-center">
              {String(balance)}{' '}
              {symbol && (
                <Coin coin={symbol} mini nonLink className="-mr-2 ml-2" />
              )}
            </span>
          </>
        ) : (
          <span className="text-v1-content-negative">No Balance</span>
        )}
      </div>
    )
  ) : null;
};

export default AmountBalanceLabel;
