import { useTranslation } from 'react-i18next';
import { useCoinSignals } from 'api';
import { ReadableNumber } from 'shared/ReadableNumber';
import PriceChange from 'shared/PriceChange';
import { Coin } from 'shared/Coin';
import { OverviewWidget } from 'shared/OverviewWidget';

export function TopCoinsWidget(_: { slug?: string }) {
  const { t } = useTranslation('coin-radar');
  const signals = useCoinSignals();

  return (
    <OverviewWidget
      contentClassName="flex flex-col gap-4"
      title={t('coin-details.tabs.trending_coins.title')}
    >
      {signals.data?.slice(0, 5).map(row => (
        <div
          key={row.symbol_name}
          className="flex flex-col gap-2 overflow-auto rounded-lg bg-v1-surface-l3 p-4"
        >
          <div className="flex items-center justify-between">
            <Coin coin={row.symbol} />
            <div className="flex flex-col items-end gap-2">
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
    </OverviewWidget>
  );
}
