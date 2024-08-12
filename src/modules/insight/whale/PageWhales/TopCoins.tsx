import { useMemo, useState, type FC } from 'react';
import { useTranslation } from 'react-i18next';
import { ReadableNumber } from 'shared/ReadableNumber';
import PriceChange from 'shared/PriceChange';
import { useWhalesCoins, type WhaleCoin } from 'api';
import { Coin } from 'shared/Coin';
import { PageTitle } from 'shared/PageTitle';
import { ButtonSelect } from 'shared/ButtonSelect';
import { TopTable, type TopTableColumn } from 'shared/TopTable';

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

  const columns = useMemo<Array<TopTableColumn<WhaleCoin>>>(
    () => [
      {
        render: (_row, index) => index + 1,
      },
      {
        render: row => (
          <Coin
            abbrevation={row.symbol_abbreviation}
            fullName={row.symbol_name}
            image={row.market_data.image}
            imageClassName="size-7"
          />
        ),
      },
      {
        render: row => (
          <div className="flex basis-1/2 items-center justify-between gap-2 text-sm mobile:flex-col mobile:items-end">
            <ReadableNumber
              value={row.market_data.current_price}
              label="usdt"
            />
            <PriceChange value={row.market_data.price_change_percentage_24h} />
          </div>
        ),
      },
    ],
    [],
  );

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
      <TopTable
        dataSource={coins.data?.results}
        columns={columns}
        rowKey={row => row.symbol_abbreviation}
      />
    </div>
  );
};
