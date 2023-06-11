import { Line } from "@ant-design/plots";
import { PointData, WealthData } from "api/backtest-types/simulateTrade";
import Spinner from "components/common/Spinner";
import { ANALYTICS_ERRORS } from "config/constants";
import {
  FilterDropdownsConfig,
  FilterNames,
  Strategy,
} from "containers/dashboard/common/Filters/constants";
import FilterDropdown from "containers/dashboard/common/Filters/FilterDropdown";
import { IFilter } from "containers/dashboard/common/Filters/types";
import { MenuTab } from "containers/dashboard/common/MenuTabs";
import isEmpty from "lodash/isEmpty";
import { FunctionComponent } from "react";
import { NotificationManager } from "react-notifications";
import { gaClick } from "utils/ga";
import { checkAllFiltersFilled, displayActiveTab } from "../../../utils";
import { tabs } from "../Analytics";
import { AatFilterDates } from "../constants";
import { useProvideAatChartDataConfig } from "../utils";

import Button from "components/Button";
import { BUTTON_TYPE } from "utils/enums";

const aatErrors = ANALYTICS_ERRORS.aat;

interface AatProps {
  aatFilter: IFilter;
  setAatFilter: (aatFilter: React.SetStateAction<IFilter>) => void;
  activeTab: MenuTab;
  onSubmit: () => void;
  coinData?: PointData[];
  aatData?: WealthData[];
  isLoading: boolean;
}

const Aat: FunctionComponent<AatProps> = ({
  aatFilter,
  setAatFilter,
  activeTab,
  onSubmit,
  isLoading,
  aatData,
  coinData,
}) => {
  const aatChartConfig = useProvideAatChartDataConfig(aatData, coinData, {
    coin: !isEmpty(aatFilter.coin)
      ? Object.keys(aatFilter.coin).filter((c) => aatFilter.coin[c])[0]
      : "",
    is_daily_basis: !!aatFilter.strategy.daily,
  });

  const onScan = () => {
    if ((aatFilter.date.start as Date) >= (aatFilter.date.end as Date)) {
      NotificationManager.error(aatErrors.dateRange.invalid);
      return;
    }

    onSubmit();
  };

  return (
    <div
      className="space-y-8"
      style={{ display: displayActiveTab(tabs[0], activeTab) }}
    >
      <div className="dashboard-panel space-y-8">
        <div className="flex w-full flex-col justify-center space-y-4 md:flex-row md:space-x-8 md:space-y-0">
          <div className="w-full md:w-1/4">
            <FilterDropdown
              className="horos-analytics-filter"
              showLabel
              placeholderText="Choose Strategy"
              updateFilter={setAatFilter}
              filter={aatFilter}
              data={FilterDropdownsConfig[FilterNames.strategy]}
              disabledItems={[Strategy.hft]}
            />
          </div>
          <div className="w-full md:w-1/4">
            <FilterDropdown
              className="horos-analytics-filter"
              showLabel
              placeholderText="Choose Coin"
              updateFilter={setAatFilter}
              filter={aatFilter}
              data={FilterDropdownsConfig[FilterNames.coins]}
              // disabledItems={aatFilter.strategy.daily ? [] : [Coins.DOGE]}
            />
          </div>
          <div className="w-full md:w-1/4">
            <FilterDropdown
              className="horos-analytics-filter"
              showLabel
              placeholderText="Choose Benchmark"
              updateFilter={setAatFilter}
              filter={aatFilter}
              data={FilterDropdownsConfig[FilterNames.benchmark]}
            />
          </div>
          <div className="w-full md:w-1/4">
            <FilterDropdown
              className="horos-analytics-filter"
              showLabel
              placeholderText="Choose Date"
              updateFilter={setAatFilter}
              filter={aatFilter}
              minDate={AatFilterDates.min}
              maxDate={AatFilterDates.max}
              data={FilterDropdownsConfig[FilterNames.date]}
            />
          </div>
        </div>
        <div className="flex w-full flex-row justify-center">
          <Button
            type={BUTTON_TYPE.FILLED}
            disabled={checkAllFiltersFilled(aatFilter) || isLoading}
            onClick={() => {
              gaClick("Aat scan click");
              onScan();
            }}
            className=" w-36"
          >
            {isLoading ? <Spinner /> : <p>Scan now</p>}
          </Button>
        </div>
      </div>

      {!isLoading && aatChartConfig && !isEmpty(aatChartConfig.data) && (
        <>
          <div className="dashboard-panel space-y-8">
            <p className="font-campton text-xl text-white">PnL Chart %</p>
            {aatChartConfig?.data && aatChartConfig && (
              <Line {...aatChartConfig} />
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Aat;
