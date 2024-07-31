import { useState, type FC } from 'react';
import { useTranslation } from 'react-i18next';
import { clsx } from 'clsx';
import { ReadableNumber } from 'shared/ReadableNumber';
import PriceChange from 'shared/PriceChange';
import { useWhalesCoins } from 'api';
import { Coin } from 'shared/Coin';
import { PageTitle } from 'shared/PageTitle';
import { ButtonSelect } from 'shared/ButtonSelect';

export const TopCoins: FC<{
  signalType: 'gainer' | 'loser';
  className?: string;
}> = ({ signalType, className }) => {
  const { t } = useTranslation('whale');
  const [timeFrame, setTimeFrame] = useState(1);

  const coins = useWhalesCoins({
    page: 1,
    pageSize: 5,
    isAscending: signalType === 'loser',
    sortBy: 'price_change_percentage_24h',
    days: timeFrame,
  });

  return (
    <div className={className}>
      <div className="mb-4 flex flex-nowrap items-center justify-between gap-4">
        <PageTitle
          title={
            signalType === 'gainer'
              ? t('sections.top-gainers')
              : t('sections.top-losers')
          }
        />
        <ButtonSelect
          className="shrink-0"
          value={timeFrame}
          onChange={setTimeFrame}
          options={[
            {
              label: t('sections.top-coins.filters.1d'),
              value: 1,
            },
            {
              label: t('sections.top-coins.filters.7d'),
              value: 7,
            },
            {
              label: t('sections.top-coins.filters.30d'),
              value: 30,
              disabled: true,
            },
          ]}
        />
      </div>
      <div
        className={clsx(
          'divide-y divide-white/5 rounded-xl bg-black/20',
          !coins.isFetched && 'animate-pulse blur-sm',
        )}
      >
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
