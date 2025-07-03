import { useTraderSettings } from 'modules/autoTrader/BuySellTrader/TraderSettingsProvider';
import { Button } from 'shared/v1-components/Button';
import { ReactComponent as SlippageIcon } from './slippage.svg';
import { ReactComponent as PriorityIcon } from './priority.svg';

export function TraderPresets({ mode }: { mode: 'buy' | 'sell' }) {
  const { traderPresets } = useTraderSettings();
  return (
    <div>
      <TraderPresetsSelector />
      <div className="flex items-center gap-2">
        {mode}
        <SlippageIcon />
        <span>{traderPresets.activePreset?.[mode].slippage}</span>
        <PriorityIcon />
        <span>
          {traderPresets.activePreset?.[mode]?.priorityFee['wrapped-solana']}
        </span>
      </div>
    </div>
  );
}

export function TraderPresetsSelector() {
  const { traderPresets } = useTraderSettings();
  return (
    <div className="flex items-center gap-2">
      {traderPresets.value?.map((preset, index) => (
        <Button key={index} variant="ghost" className="bg-transparent">
          P{index}
        </Button>
      ))}
    </div>
  );
}
