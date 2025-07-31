import BtnSolanaWallets from 'modules/base/wallet/BtnSolanaWallets';
import { AccountBalance } from 'modules/autoTrader/PageTrade/AdvancedSignalForm/AccountBalance';

const AmountBalanceLabel: React.FC<{
  slug?: string;
  disabled?: boolean;
  setAmount?: (val: string) => void;
}> = ({ slug, disabled, setAmount }) => {
  return (
    <div className="flex items-center justify-between text-xs">
      <span>Amount</span>
      <div className="flex items-center justify-between">
        <BtnSolanaWallets className="!h-auto scale-[0.8] !bg-transparent !p-0" />
        <AccountBalance slug={slug} disabled={disabled} setAmount={setAmount} />
      </div>
    </div>
  );
};

export default AmountBalanceLabel;
