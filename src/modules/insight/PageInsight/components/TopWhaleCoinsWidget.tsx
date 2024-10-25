import { useTranslation } from 'react-i18next';
import { useHasFlag, useWhalesCoins } from 'api';
import { ReadableNumber } from 'shared/ReadableNumber';
import { Coin } from 'shared/Coin';
import { OverviewWidget } from 'shared/OverviewWidget';
import { InformativePrice } from 'shared/InformativePrice';
import { ProLocker } from 'shared/ProLocker';
import { SeeMoreLink } from './SeeMoreLink';

export function TopWhaleCoinsWidget({ className }: { className?: string }) {
  const { t } = useTranslation('whale');
  const hasFlag = useHasFlag();
  const coins = useWhalesCoins({
    page: 1,
    pageSize: 5,
    days: 1,
  });

  if (!hasFlag('/insight/whales')) return null;

  return (
    <OverviewWidget
      className={className}
      title={t('whale:sections.top-coins.title')}
      info={t('whale:sections.top-coins.subtitle')}
      headerActions={<SeeMoreLink to="/insight/whales" />}
      contentClassName="flex flex-col gap-4"
      loading={coins.isLoading}
      empty={coins.data?.results.length === 0}
    >
      <ProLocker mode="children" level={1}>
        {coins.data?.results.map(row => (
          <div
            key={row.symbol.name + (row.symbol.slug ?? '')}
            className="flex shrink-0 flex-col gap-2 overflow-auto rounded-lg bg-v1-surface-l3 p-4"
          >
            <div className="flex items-center justify-between gap-1 overflow-hidden">
              <Coin coin={row.symbol} className="overflow-auto" />
              <InformativePrice
                price={row.market_data.current_price}
                priceChange={row.market_data.price_change_percentage_24h}
                className="shrink-0 items-end text-sm"
              />
            </div>
            <hr className="border-v1-border-tertiary" />
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="text-xxs text-v1-content-secondary">
                  {t('whale:sections.top-coins.table.transactions')}
                </div>
                <ReadableNumber
                  className="text-sm"
                  value={
                    (row.total_sell_number ?? 0) + (row.total_buy_number ?? 0)
                  }
                />
              </div>
              <div>
                <div className="text-xxs text-v1-content-secondary">
                  {t('whale:sections.top-coins.table.total-vol')}
                </div>
                <ReadableNumber
                  className="text-sm"
                  value={row.total_transfer_volume}
                  label={row.symbol.abbreviation}
                />
              </div>
            </div>
          </div>
        ))}
      </ProLocker>
    </OverviewWidget>
  );
}
