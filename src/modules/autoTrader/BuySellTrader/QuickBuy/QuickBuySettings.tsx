import { TraderPresetsSelector } from 'modules/autoTrader/BuySellTrader/TraderPresets';
import { Input } from 'shared/v1-components/Input';
import { useUserSettings } from 'modules/base/auth/UserSettingsProvider';
import { useSymbolInfo } from 'api/symbol';
import { Coin } from 'shared/Coin';
import { ReactComponent as InstantIcon } from '../BtnInstantTrade/instant.svg';

export default function QuickBuySettings({
  source,
}: {
  source: 'new_pairs' | 'final_stretch' | 'migrated';
}) {
  const { settings, updateQuickBuyAmount } = useUserSettings();
  const { data: solanaSymbol } = useSymbolInfo('wrapped-solana');

  return (
    <div className="mr-8 flex items-center gap-1">
      <Input
        size="xs"
        type="string"
        className="w-28"
        value={settings.quick_buy[source].amount}
        prefixIcon={<InstantIcon className="-ml-1 !size-8" />}
        suffixIcon={
          solanaSymbol && (
            <Coin className="-mr-3" coin={solanaSymbol} mini noText nonLink />
          )
        }
        onChange={newValue => updateQuickBuyAmount(source, newValue)}
      />
      <TraderPresetsSelector source={source} size="xs" />
    </div>
  );
}
