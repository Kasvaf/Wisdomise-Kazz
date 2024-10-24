import { useTranslation } from 'react-i18next';
import { useCoinSignals } from 'api';
import { Coin } from 'shared/Coin';
import { OverviewWidget } from 'shared/OverviewWidget';
import { InformativePrice } from 'shared/InformativePrice';
import { ProGuard } from 'modules/base/auth/pro/ProGuard';

export function TopCoinsWidget(_: { slug?: string }) {
  const { t } = useTranslation('coin-radar');
  const signals = useCoinSignals();

  return (
    <OverviewWidget
      contentClassName="flex flex-col gap-4"
      title={t('coin-details.tabs.trending_coins.title')}
      loading={signals.isLoading}
      empty={signals.data?.length === 0}
    >
      <ProGuard mode="children" level={2}>
        {signals.data?.slice(0, 5).map(row => (
          <div
            key={row.symbol_name}
            className="flex flex-col gap-2 overflow-auto rounded-lg bg-v1-surface-l3 p-4"
          >
            <div className="flex items-center justify-between gap-2">
              <Coin coin={row.symbol} />
              <div className="flex items-end">
                <InformativePrice
                  price={row.current_price}
                  priceChange={row.price_change_percentage}
                  className="items-end text-sm"
                />
              </div>
            </div>
          </div>
        ))}
      </ProGuard>
    </OverviewWidget>
  );
}
