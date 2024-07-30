import { type FC } from 'react';
import { useTranslation } from 'react-i18next';
import { ReadableNumber } from 'shared/ReadableNumber';
import PriceChange from 'shared/PriceChange';
import { useWhalesCoins } from 'api';
import { Coin } from 'shared/Coin';

export const TopCoins: FC<{
  signalType: 'gainer' | 'loser';
  timeFrame: number;
  className?: string;
}> = ({ signalType, className, timeFrame }) => {
  const { t } = useTranslation('whale');

  const coins = useWhalesCoins({
    page: 1,
    pageSize: 5,
    isAscending: signalType === 'loser',
    sortBy: 'price_change_percentage_24h',
    days: timeFrame,
  });

  return (
    <div className={className}>
      <h2 className="mb-4 text-xl font-semibold">
        {signalType === 'gainer'
          ? t('sections.top-gainers')
          : t('sections.top-losers')}
      </h2>
      <div className="divide-y divide-white/5 rounded-xl bg-black/20">
        {coins.data?.results.map((row, index) => (
          <div
            key={row.symbol_abbreviation}
            className="flex items-center justify-start gap-7 p-5 mobile:gap-6"
          >
            <div className="text-sm font-medium">{index + 1}</div>
            <div className="grow text-sm font-medium">
              <Coin
                abbrevation={row.symbol_abbreviation}
                fullName={row.symbol_name}
                image={row.market_data.image}
                imageClassName="size-7"
              />
            </div>
            <div className="flex basis-1/2 items-center justify-between gap-2 text-sm mobile:flex-col mobile:items-end">
              <ReadableNumber
                value={row.market_data.current_price}
                label="usdt"
              />
              <PriceChange
                value={row.market_data.price_change_percentage_24h}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
