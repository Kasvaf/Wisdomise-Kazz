import { clsx } from 'clsx';
import { TraderPresetsSelector } from 'modules/autoTrader/BuySellTrader/TraderPresets';
import { Input } from 'shared/v1-components/Input';
import {
  type QuickBuySource,
  useUserSettings,
} from 'modules/base/auth/UserSettingsProvider';
import { useSymbolInfo } from 'api/symbol';
import { Coin } from 'shared/Coin';
import BtnSolanaWallets from 'modules/base/wallet/BtnSolanaWallets';
import { useIsLoggedIn } from 'modules/base/auth/jwt-store';
import { HoverTooltip } from 'shared/HoverTooltip';
import { preventNonNumericInput } from 'utils/numbers';
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
  const isLoggedIn = useIsLoggedIn();

  return isLoggedIn ? (
    <div className={clsx(className, 'flex items-center gap-2')}>
      {showWallet && (
        <HoverTooltip title="Balance">
          <BtnSolanaWallets showBalance={true} surface={2} />
        </HoverTooltip>
      )}
      <HoverTooltip title="Quick Buy Amount" ignoreFocus>
        <Input
          size="xs"
          type="string"
          className="!flex w-28"
          placeholder="0.0"
          surface={2}
          value={settings.quick_buy[source].amount}
          prefixIcon={<InstantIcon className="!size-8 -ml-1" />}
          suffixIcon={
            solanaSymbol && (
              <Coin className="-mr-3" coin={solanaSymbol} mini noText nonLink />
            )
          }
          onKeyDown={preventNonNumericInput}
          onChange={newValue => updateQuickBuyAmount(source, newValue)}
        />
      </HoverTooltip>
      <TraderPresetsSelector source={source} size="xs" showValue surface={2} />
    </div>
  ) : null;
}
