import { useTranslation } from 'react-i18next';
import { useHasFlag, useWhalesCoins } from 'api';
import PriceChange from 'shared/PriceChange';
import { ReadableNumber } from 'shared/ReadableNumber';
import { Coin } from 'shared/Coin';
import { OverviewWidget } from 'shared/OverviewWidget';
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
      {coins.data?.results.map(row => (
        <div
          key={row.symbol_name}
          className="flex shrink-0 flex-col gap-2 overflow-auto rounded-lg bg-v1-surface-l3 p-4"
        >
          <div className="flex items-center justify-between">
            <Coin coin={row.symbol} />
            <div className="flex items-center gap-2">
              <ReadableNumber
                label="usdt"
                value={row.market_data.current_price}
                className="text-sm"
              />
              <PriceChange
                className="text-xxs"
                value={row.market_data.price_change_percentage_24h}
                suffix=" (24h)"
              />
            </div>
          </div>
          <hr className="border-v1-border-tertiary" />
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="text-xxs text-v1-content-secondary">
                {t('whale:sections.top-coins.table.transactions')}
              </div>
              <ReadableNumber
                className="text-sm"
                value={row.total_transactions}
              />
            </div>
            <div>
              <div className="text-xxs text-v1-content-secondary">
                {t('whale:sections.top-coins.table.total-vol')}
              </div>
              <ReadableNumber
                className="text-sm"
                value={row.total_volume}
                label={row.symbol_abbreviation}
              />
            </div>
          </div>
        </div>
      ))}
    </OverviewWidget>
  );
}
