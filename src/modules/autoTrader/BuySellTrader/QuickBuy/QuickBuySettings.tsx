import { clsx } from 'clsx';
import { TraderPresetsSelector } from 'modules/autoTrader/BuySellTrader/TraderPresets';
import { SolanaCoin } from 'modules/autoTrader/CoinSwapActivity';
import { useIsLoggedIn } from 'modules/base/auth/jwt-store';
import {
  type TradeSettingsSource,
  useUserSettings,
} from 'modules/base/auth/UserSettingsProvider';
import BtnSolanaWallets from 'modules/base/wallet/BtnSolanaWallets';
import { HoverTooltip } from 'shared/HoverTooltip';
import { Input } from 'shared/v1-components/Input';
import { preventNonNumericInput } from 'utils/numbers';
import type { Surface } from 'utils/useSurface';
import { ReactComponent as InstantIcon } from '../BtnInstantTrade/instant.svg';

export default function QuickBuySettings({
  source,
  className,
  showWallet,
  surface = 2,
}: {
  source: TradeSettingsSource;
  className?: string;
  showWallet?: boolean;
  surface?: Surface;
}) {
  const { settings, updateQuickBuyAmount } = useUserSettings();
  const isLoggedIn = useIsLoggedIn();

  return isLoggedIn ? (
    <div className={clsx(className, 'flex items-center gap-2')}>
      {showWallet && (
        <HoverTooltip title="Balance">
          <BtnSolanaWallets showBalance={true} surface={surface} />
        </HoverTooltip>
      )}
      <HoverTooltip ignoreFocus title="Quick Buy Amount">
        <Input
          className="!flex w-28"
          onChange={newValue => updateQuickBuyAmount(source, newValue)}
          onKeyDown={preventNonNumericInput}
          placeholder="0.0"
          prefixIcon={<InstantIcon className="!size-8 -ml-1" />}
          size="xs"
          suffixIcon={<SolanaCoin className="!-mr-3" />}
          surface={surface}
          type="string"
          value={settings.quick_buy[source].amount}
        />
      </HoverTooltip>
      <TraderPresetsSelector
        showValue
        size="xs"
        source={source}
        surface={surface}
      />
    </div>
  ) : null;
}
