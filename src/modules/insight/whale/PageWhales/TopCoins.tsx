import { type FC } from 'react';
import { useTranslation } from 'react-i18next';
import { ReadableNumber } from 'shared/ReadableNumber';
import PriceChange from 'shared/PriceChange';
import { useWhalesCoins } from 'api';

export const TopCoins: FC<{
  signalType: 'gainer' | 'loser';
  className?: string;
}> = ({ signalType, className }) => {
  const { t } = useTranslation('whale');

  const coins = useWhalesCoins({
    page: 1,
    pageSize: 5,
    isAscending: signalType === 'loser',
    sortBy: 'price_change_percentage_24h',
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
              <div className="flex items-center gap-2">
                {row.market_data.image ? (
                  <img
                    src={row.market_data.image}
                    className="size-7 rounded-full"
                  />
                ) : (
                  <div className="size-7 rounded-full bg-white/5" />
                )}
                <div>
                  <p className="overflow-hidden whitespace-nowrap text-xs">
                    {row.symbol_name}
                  </p>
                  <p className="text-xxs font-light opacity-60">
                    {row.symbol_abbreviation}
                  </p>
                </div>
              </div>
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
