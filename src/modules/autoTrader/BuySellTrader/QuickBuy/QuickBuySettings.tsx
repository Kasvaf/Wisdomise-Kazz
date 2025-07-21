import { clsx } from 'clsx';
import {
  BtnTraderPresetsSettings,
  TraderPresetsSelector,
} from 'modules/autoTrader/BuySellTrader/TraderPresets';
import { Input } from 'shared/v1-components/Input';
import {
  type QuickBuySource,
  useUserSettings,
} from 'modules/base/auth/UserSettingsProvider';
import { useSymbolInfo } from 'api/symbol';
import { Coin } from 'shared/Coin';
import BtnSolanaWallets from 'modules/base/wallet/BtnSolanaWallets';
import { ReactComponent as InstantIcon } from '../BtnInstantTrade/instant.svg';

export default function QuickBuySettings({
  source,
  className,
  showWallet,
}: {
  source: QuickBuySource;
  className?: string;
  showWallet?: boolean;
}) {
  const { settings, updateQuickBuyAmount } = useUserSettings();
  const { data: solanaSymbol } = useSymbolInfo('wrapped-solana');

  return (
    <div className={clsx(className, 'flex items-center gap-2')}>
      <BtnTraderPresetsSettings />
      {showWallet && <BtnSolanaWallets showBalance={true} />}
      <Input
        size="xs"
        type="string"
        className="w-28"
        placeholder="0.0"
        value={settings.quick_buy[source].amount}
        prefixIcon={<InstantIcon className="-ml-1 !size-8" />}
        suffixIcon={
          solanaSymbol && (
            <Coin className="-mr-3" coin={solanaSymbol} mini noText nonLink />
          )
        }
        onChange={newValue => updateQuickBuyAmount(source, newValue)}
      />
      <TraderPresetsSelector source={source} size="xs" showValue />
    </div>
  );
}
