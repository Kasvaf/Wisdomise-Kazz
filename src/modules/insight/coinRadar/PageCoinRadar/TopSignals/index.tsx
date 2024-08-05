import { type FC, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useCoinSignals } from 'api';
import { ReadableNumber } from 'shared/ReadableNumber';
import PriceChange from 'shared/PriceChange';
import { Coin } from 'shared/Coin';

export const TopSignals: FC<{
  signalType: 'gainer' | 'loser';
  className?: string;
}> = ({ signalType, className }) => {
  const { t } = useTranslation('coin-radar');

  const signals = useCoinSignals({
    meta: {
      windowHours: 24,
    },
  });

  const filteredSignals = useMemo(() => {
    return (signals.data ?? [])
      .filter(row => typeof row.price_change_percentage === 'number')
      .sort((a, b) => {
        if (signalType === 'gainer') {
          return (
            (b.price_change_percentage ?? 0) - (a.price_change_percentage ?? 0)
          );
        }
        return (
          (a.price_change_percentage ?? 0) - (b.price_change_percentage ?? 0)
        );
      })
      .slice(0, 5);
  }, [signals.data, signalType]);

  return (
    <div className={className}>
      <h2 className="mb-4 text-xl font-semibold">
        {signalType === 'gainer'
          ? t('tops-section.gainers')
          : t('tops-section.losers')}
      </h2>
      <div className="divide-y divide-white/5 rounded-xl bg-black/20">
        {filteredSignals.map((row, index) => (
          <div
            key={row.symbol_name}
            className="flex items-center justify-start gap-7 p-5 mobile:gap-6"
          >
            <div className="text-sm font-medium">{index + 1}</div>
            <div className="grow text-sm font-medium">
              <Coin abbrevation={row.symbol_name} image={row.image} />
            </div>
            <div className="flex basis-1/2 items-center justify-between gap-2 text-sm mobile:flex-col mobile:items-end">
              <ReadableNumber value={row.current_price} label="usdt" />
              <PriceChange value={row.price_change_percentage} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
