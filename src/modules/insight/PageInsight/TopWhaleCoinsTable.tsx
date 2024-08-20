import { useTranslation } from 'react-i18next';
import { useWhalesCoins } from 'api';
import PriceChange from 'shared/PriceChange';
import { ReadableNumber } from 'shared/ReadableNumber';
import { Coin } from 'shared/Coin';

export function TopWhaleCoinsTable() {
  const { t } = useTranslation('whale');

  const coins = useWhalesCoins({
    page: 1,
    pageSize: 5,
    days: 1,
  });

  return (
    <div className="flex flex-col gap-4">
      {coins.data?.results.map(row => (
        <div
          key={row.symbol_name}
          className="flex flex-col gap-2 overflow-auto rounded-lg bg-v1-surface-l3 p-4"
        >
          <div className="flex items-center justify-between">
            <Coin
              abbrevation={row.symbol_abbreviation}
              fullName={row.symbol_name}
              image={row.market_data.image}
            />
            <div className="flex items-center gap-2">
              <ReadableNumber
                label="usdt"
                value={row.market_data.current_price}
                className="text-base"
              />
              <PriceChange
                className="text-xs"
                value={row.market_data.price_change_percentage_24h}
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
    </div>
  );
}
