/* eslint-disable @typescript-eslint/no-explicit-any */
import { format } from 'date-fns';
import { notification } from 'antd';
import { type FunctionComponent, useCallback, useState } from 'react';
import { useLazySimulateTradeQuery } from 'old-api/horosApi';
import MenuTabs, { type MenuTab, TabLabels } from './MenuTabs';
import { type IFilter } from './Filters/types';
import Aat from './Aat';

export const tabs: MenuTab[] = [
  {
    id: 'aat',
    label: 'Back test - AAT',
    tooltip:
      'Run backtests for the performance of the AAT against different strategies, assets, and benchmarks',
  },
];

const Analytics: FunctionComponent = () => {
  const [
    getSimulateTrade,
    {
      data: { aat: aatData, coin: coinData } = { aat: [], coin: [] },
      isFetching: isAatFetching,
      isLoading: isAatLoading,
    },
  ] = useLazySimulateTradeQuery();

  const [activeTab, setActiveTab] = useState<MenuTab>(tabs[0]);
  const [aatFilter, setAatFilter] = useState<IFilter>({
    coins: {},
    strategy: {},
    benchmark: {},
    date: {},
  });

  const onAatScan = useCallback(async () => {
    const start_date = format(aatFilter.date.start as Date, 'yyyy-MM-dd');
    const end_date = format(aatFilter.date.end as Date, 'yyyy-MM-dd');

    const coin = Object.keys(aatFilter.coins).find(key => aatFilter.coins[key]);
    if (!coin) return;

    try {
      await Promise.all([
        getSimulateTrade({
          coin,
          is_daily_basis: !!aatFilter.strategy.daily,
          start_date,
          end_date,
        }).unwrap(),
      ]);
    } catch (error: any) {
      if (error?.status === 400) {
        notification.error({ message: error.data.error });
      }
    }
  }, [aatFilter, getSimulateTrade]);

  return (
    <div className="flex w-full flex-col space-y-8">
      <MenuTabs
        tabs={tabs}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        dashboardSection={TabLabels.backtest}
      />
      <Aat
        aatData={aatData}
        coinData={coinData}
        onSubmit={onAatScan}
        activeTab={activeTab}
        setAatFilter={setAatFilter}
        aatFilter={aatFilter}
        isLoading={isAatLoading || isAatFetching}
      />
    </div>
  );
};

export default Analytics;
