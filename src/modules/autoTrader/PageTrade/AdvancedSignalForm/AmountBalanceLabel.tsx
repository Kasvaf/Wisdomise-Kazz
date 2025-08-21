import { AccountBalance } from 'modules/autoTrader/PageTrade/AdvancedSignalForm/AccountBalance';
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
        <BtnSolanaWallets className="!h-auto !bg-transparent !p-0 scale-[0.8]" />
        <AccountBalance disabled={disabled} setAmount={setAmount} slug={slug} />
      </div>
    </div>
  );
};

export default AmountBalanceLabel;
