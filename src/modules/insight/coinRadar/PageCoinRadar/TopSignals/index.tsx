import { type FC, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { type CoinSignal, useCoinSignals } from 'api';
import { ReadableNumber } from 'shared/ReadableNumber';
import PriceChange from 'shared/PriceChange';
import { Coin } from 'shared/Coin';
import { TopTable, type TopTableColumn } from 'shared/TopTable';
import { WindowHoursSelect } from '../HotCoins/WindowHoursSelect';

export const TopSignals: FC<{
  signalType: 'gainer' | 'loser';
  className?: string;
}> = ({ signalType, className }) => {
  const { t } = useTranslation('coin-radar');
  const [windowHours, setWindowHours] = useState(24);
  const signals = useCoinSignals({
    meta: {
      windowHours,
    },
  });

  const filteredSignals = useMemo(() => {
    return (signals.data ?? [])
      .filter(row => typeof row.price_change_percentage === 'number')
      .sort((a, b) => {
        if (signalType === 'gainer') {
          return (
            (b.price_change_percentage ?? 0) - (a.price_change_percentage ?? 0)
          );
        }
        return (
          (a.price_change_percentage ?? 0) - (b.price_change_percentage ?? 0)
        );
      })
      .slice(0, 5);
  }, [signals.data, signalType]);

  const columns = useMemo<Array<TopTableColumn<CoinSignal>>>(
    () => [
      {
        render: (_row, index) => index + 1,
      },
      {
        render: row => <Coin abbrevation={row.symbol_name} image={row.image} />,
      },
      {
        render: row => (
          <div className="flex basis-1/2 items-center justify-between gap-2 text-sm mobile:flex-col mobile:items-end">
            <ReadableNumber value={row.current_price} label="usdt" />
            <PriceChange value={row.price_change_percentage} />
          </div>
        ),
      },
    ],
    [],
  );

  return (
    <div className={className}>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold">
          {signalType === 'gainer'
            ? t('tops-section.gainers')
            : t('tops-section.losers')}
        </h2>
        <WindowHoursSelect value={windowHours} onChange={setWindowHours} />
      </div>
      <TopTable
        dataSource={filteredSignals}
        columns={columns}
        rowKey={row => row.symbol_name}
        loading={signals.isFetching && signals.isPreviousData}
      />
    </div>
  );
};
