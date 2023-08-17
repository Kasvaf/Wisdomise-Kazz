import isEmpty from 'lodash/isEmpty';
import { type FunctionComponent } from 'react';
import { notification } from 'antd';
import { Line } from '@ant-design/plots';
import { ANALYTICS_ERRORS } from 'config/constants';
import { type PointData, type WealthData } from 'old-api/backtest-types';
import { gaClick } from 'utils/ga';
import Spinner from 'modules/shared/Spinner';
import ButtonV1, { BUTTON_TYPE } from 'modules/shared/ButtonV1';
import {
  FilterDropdownsConfig,
  FilterNames,
  Strategy,
} from '../Filters/constants';
import FilterDropdown from '../Filters/FilterDropdown';
import { type IFilter } from '../Filters/types';
import { type MenuTab } from '../MenuTabs';
import { AatFilterDates } from '../constants';
import { checkAllFiltersFilled, displayActiveTab } from '../utils';
import { useProvideAatChartDataConfig } from './useProvideAatChartDataConfig';

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
    coin: Object.keys(aatFilter.coin).find(c => aatFilter.coin[c]) ?? '',
    is_daily_basis: !!aatFilter.strategy.daily,
  });

  const onScan = () => {
    if ((aatFilter.date.start as Date) >= (aatFilter.date.end as Date)) {
      notification.error({ message: aatErrors.dateRange.invalid });
      return;
    }

    onSubmit();
  };

  return (
    <div
      className="space-y-8"
      style={{ display: displayActiveTab('aat', activeTab) }}
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
          <ButtonV1
            type={BUTTON_TYPE.FILLED}
            disabled={checkAllFiltersFilled(aatFilter) || isLoading}
            onClick={() => {
              gaClick('Aat scan click');
              onScan();
            }}
            className=" w-36"
          >
            {isLoading ? <Spinner /> : <p>Scan now</p>}
          </ButtonV1>
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
