import { useCoinSignals } from 'api';
import { ReadableNumber } from 'shared/ReadableNumber';
import PriceChange from 'shared/PriceChange';
import { Coin } from 'shared/Coin';

export function TopCoins({ slug }: { slug: string }) {
  const signals = useCoinSignals({
    meta: {
      windowHours: 24,
    },
  });

  return (
    <div className="flex flex-col gap-4">
      {signals.data
        ?.filter(row => row.symbol.slug !== slug)
        .slice(0, 5)
        .map(row => (
          <div
            key={row.symbol_name}
            className="flex flex-col gap-2 overflow-auto rounded-lg bg-v1-surface-l3 p-4"
          >
            <div className="flex items-center justify-between">
              <Coin coin={row.symbol} />
              <div className="flex flex-col items-center gap-2">
                <ReadableNumber
                  label="usdt"
                  value={row.current_price}
                  className="text-sm"
                />
                <PriceChange
                  className="text-xxs"
                  value={row.price_change_percentage}
                />
              </div>
            </div>
          </div>
        ))}
    </div>
  );
}
