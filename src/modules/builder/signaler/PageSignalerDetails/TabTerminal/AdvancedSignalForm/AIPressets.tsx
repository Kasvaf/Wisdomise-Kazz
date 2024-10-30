import { v4 } from 'uuid';
import { useEffect, useState } from 'react';
import Button from 'shared/Button';
import { useCoinOverview } from 'api';
import { type SignalFormState } from './useSignalFormStates';
import { ReactComponent as LogoIcon } from './wisdomise-ai.svg';

interface PresetOrder {
  price: number;
  volume: number;
}

interface Preset {
  title: string;
  openVolume: number;
  safetyOpens: PresetOrder[];
  TPs: PresetOrder[];
  SLs: PresetOrder[];
}

const orderToOrder = (x: PresetOrder) => ({
  amountRatio: String(x.volume),
  priceExact: String(x.price),
  applied: false,
  removed: false,
  key: v4(),
});

const AIPresets: React.FC<{
  data: SignalFormState;
  assetName: string;
}> = ({ data, assetName }) => {
  const [activePreset, setActivePreset] = useState(3);
  const { data: coin, isLoading } = useCoinOverview({
    slug: assetName,
    priceHistoryDays: 1,
  });

  const {
    orderType: [orderType, setOrderType],
    volume: [volume, setVolume],
    safetyOpens: [safetyOpens, setSafetyOpens],
    takeProfits: [takeProfits, setTakeProfits],
    stopLosses: [stopLosses, setStopLosses],
  } = data;

  useEffect(() => {
    setActivePreset(activePreset < 0 ? -activePreset - 1 : 3);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderType, volume, safetyOpens, takeProfits, stopLosses]);

  if (isLoading || !coin?.data) {
    return <></>;
  }

  const price = coin.data.current_price;
  const atr = price * 0.1;

  const presets: Preset[] = [
    {
      title: 'Low Risk',
      openVolume: 50,
      safetyOpens: [
        {
          price: price - 2 * atr,
          volume: 50,
        },
      ],
      SLs: [
        {
          price: price - 4 * atr,
          volume: 50,
        },
        {
          price: price - 8 * atr,
          volume: 100,
        },
      ],
      TPs: [
        {
          price: price + 6 * atr,
          volume: 33,
        },
        {
          price: price + 8 * atr,
          volume: 66,
        },
        {
          price: price + 10 * atr,
          volume: 100,
        },
      ],
    },
    {
      title: 'Medium Risk',
      openVolume: 50,
      safetyOpens: [
        {
          price: price - 1 * atr,
          volume: 50,
        },
      ],
      SLs: [
        {
          price: price - 2.5 * atr,
          volume: 50,
        },
        {
          price: price - 4 * atr,
          volume: 100,
        },
      ],
      TPs: [
        {
          price: price + 2.5 * atr,
          volume: 33,
        },
        {
          price: price + 3.5 * atr,
          volume: 66,
        },
        {
          price: price + 5 * atr,
          volume: 100,
        },
      ],
    },
    {
      title: 'High Risk',
      openVolume: 50,
      safetyOpens: [
        {
          price: price - 0.5 * atr,
          volume: 50,
        },
      ],
      SLs: [
        {
          price: price - 1.5 * atr,
          volume: 50,
        },
        {
          price: price - 2 * atr,
          volume: 100,
        },
      ],
      TPs: [
        {
          price: price + 1.5 * atr,
          volume: 33,
        },
        {
          price: price + 2.5 * atr,
          volume: 66,
        },
        {
          price: price + 3.5 * atr,
          volume: 100,
        },
      ],
    },
  ];

  const selectVariant = (p: Preset, ind: number) => {
    setOrderType('market');
    setVolume(String(p.openVolume));
    setSafetyOpens(p.safetyOpens.map(orderToOrder));
    setTakeProfits(p.safetyOpens.map(orderToOrder));
    setStopLosses(p.SLs.map(orderToOrder));
    setActivePreset(-ind - 1);
  };

  return (
    <div className="rounded-xl bg-v1-surface-l2 p-3">
      <div className="mb-4 flex items-center gap-2">
        <LogoIcon className="h-6 w-6" />
        <div className="text-xs font-normal">Wisdomise AI Preset</div>
      </div>

      <div className="flex items-center justify-between">
        {presets.map((p, ind) => (
          <Button
            key={p.title}
            variant={activePreset === ind ? 'primary' : 'secondary'}
            className="!p-3 !text-xs"
            onClick={() => selectVariant(p, ind)}
          >
            {p.title}
          </Button>
        ))}

        <Button
          variant={activePreset === 3 ? 'primary' : 'secondary'}
          className="!p-3 !text-xs"
          onClick={() => setActivePreset(3)}
        >
          Manual
        </Button>
      </div>
    </div>
  );
};

export default AIPresets;
