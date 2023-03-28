/* eslint-disable @typescript-eslint/no-explicit-any */
import { FunctionComponent, useState, useCallback } from "react";
import { useLazySimulateTradeQuery } from "api/horosApi";
import { IFilter } from "containers/dashboard/common/Filters/types";
import MenuTabs, { MenuTab } from "containers/dashboard/common/MenuTabs";
import { TabLabels } from "containers/dashboard/types";
import { format } from "date-fns";
import Aat from "./Aat";
import { NotificationManager } from "react-notifications";

export const tabs: MenuTab[] = [
  {
    id: "aat",
    label: "Back test - AAT",
    tooltip:
      "Run backtests for the performance of the Horos AAT against different strategies, assets, and benchmarks",
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
    const start_date = format(aatFilter.date.start as Date, "yyyy-MM-dd");
    const end_date = format(aatFilter.date.end as Date, "yyyy-MM-dd");

    const aatPayload = {
      coin: Object.keys(aatFilter.coins).filter(
        (key) => aatFilter.coins[key]
      )[0],
      is_daily_basis: !!aatFilter.strategy.daily,
      start_date,
      end_date,
    };

    try {
      await Promise.all([getSimulateTrade(aatPayload).unwrap()]);
    } catch (error: any) {
      if (error?.status === 400) {
        NotificationManager.error(error.data.error);
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
