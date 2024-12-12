import { v4 } from 'uuid';
import { useEffect, useState } from 'react';
import Button from 'shared/Button';
import {
  type OrderPresetItem,
  type PresetKeys,
  useAIPresets,
} from 'api/ai-presets';
import { roundSensible } from 'utils/numbers';
import { type TpSlData, type SignalFormState } from './useSignalFormStates';
import { ReactComponent as LogoIcon } from './wisdomise-ai.svg';
import { ReactComponent as StarIcon } from './StarIcon.svg';
import GradientBG from './GradientBG.svg';

const orderToOrder = (x: OrderPresetItem) => ({
  amountRatio: roundSensible(x.amount * 100),
  priceExact: String(x.price),
  applied: false,
  removed: false,
  key: v4(),
});

const fromApi = (items?: OrderPresetItem[]) => {
  const result: TpSlData[] = [];
  if (!items?.length) return result;

  let prevSum = 0;
  for (const x of items) {
    const amount = x.amount * (1 - prevSum);
    prevSum += amount;
    result.push(orderToOrder({ amount, price: x.price }));
  }
  return result;
};

const AIPresets: React.FC<{
  data: SignalFormState;
  assetSlug: string;
}> = ({ data, assetSlug }) => {
  const [activePreset, setActivePreset] = useState(3);
  const { data: presets, isLoading } = useAIPresets(assetSlug + '/tether');

  const {
    isUpdate: [isUpdate],
    orderType: [orderType, setOrderType],
    volume: [volume, setVolume],
    priceUpdated: [, setPriceUpdated],
    safetyOpens: [safetyOpens, setSafetyOpens],
    takeProfits: [takeProfits, setTakeProfits],
    stopLosses: [stopLosses, setStopLosses],
  } = data;

  useEffect(() => {
    setActivePreset(activePreset < 0 ? -activePreset - 1 : 3);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderType, volume, safetyOpens, takeProfits, stopLosses]);

  if (isLoading || !presets) {
    return <></>;
  }

  const presetKeys = ['low', 'medium', 'high'] as PresetKeys[];
  const selectVariant = (ind: number) => {
    if (ind > 2 || ind < 0) {
      setActivePreset(3);
      return;
    }

    const p = presets[presetKeys[ind]];
    setOrderType('market');
    setVolume(String(p.open_orders[0].amount * 100));
    setPriceUpdated(false);
    setSafetyOpens(p.open_orders.slice(1).map(orderToOrder));
    setTakeProfits(fromApi(p.take_profits));
    setStopLosses(fromApi(p.stop_losses));
    setActivePreset(-ind - 1);
  };

  if (isUpdate) return null;

  return (
    <div
      className="overflow-hidden rounded-xl bg-v1-surface-l2 bg-cover p-3"
      style={{ backgroundImage: `url(${GradientBG})` }}
    >
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <LogoIcon className="h-6 w-6" />
          <div className="text-xs font-normal">Wisdomise AI Preset</div>
        </div>
        <StarIcon />
      </div>

      <div className="flex items-center justify-between">
        {['low', 'medium', 'high', 'manual'].map((key, ind) => (
          <Button
            key={key}
            variant={activePreset === ind ? 'primary' : 'secondary'}
            className="!p-3 !text-xs"
            onClick={() => selectVariant(ind)}
          >
            {key[0].toUpperCase() + key.substring(1) + (ind < 3 ? ' Risk' : '')}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default AIPresets;
