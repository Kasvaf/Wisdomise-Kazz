import { clsx } from 'clsx';
import { TraderPresetsSelector } from 'modules/autoTrader/BuySellTrader/TraderPresets';
import { SolanaIcon } from 'modules/autoTrader/CoinSwapActivity';
import { useIsLoggedIn } from 'modules/base/auth/jwt-store';
import {
  type TradeSettingsSource,
  useUserSettings,
} from 'modules/base/auth/UserSettingsProvider';
import { HoverTooltip } from 'shared/HoverTooltip';
import { Input } from 'shared/v1-components/Input';
import { preventNonNumericInput } from 'utils/numbers';
import type { Surface } from 'utils/useSurface';
import { ReactComponent as InstantIcon } from '../BtnInstantTrade/instant.svg';

export default function QuickBuySettings({
  source,
  className,
  surface = 2,
}: {
  source: TradeSettingsSource;
  className?: string;
  surface?: Surface;
}) {
  const { settings, updateQuickBuyAmount } = useUserSettings();
  const isLoggedIn = useIsLoggedIn();

  return isLoggedIn ? (
    <div className={clsx(className, 'flex items-center gap-2')}>
      <HoverTooltip ignoreFocus title="Quick Buy Amount">
        <Input
          className="!flex w-28"
          onChange={newValue => updateQuickBuyAmount(source, newValue)}
          onKeyDown={preventNonNumericInput}
          placeholder="0.0"
          prefixIcon={<InstantIcon className="!size-8 -ml-1" />}
          size="xs"
          suffixIcon={<SolanaIcon className="!-mr-1" />}
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
