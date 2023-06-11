import { ReactComponent as FilterIcons } from "@images/filters.svg";
import { Dropdown } from "antd";
import Button from "components/Button";
import {
  DropdownConfig,
  Strategy,
} from "containers/dashboard/common/Filters/constants";
import { cleanFilter } from "containers/dashboard/components/Signals/constants";
import { cloneDeep } from "lodash";
import {
  Dispatch,
  FunctionComponent,
  SetStateAction,
  useMemo,
  useState,
} from "react";
import { BUTTON_TYPE } from "utils/enums";
import { gaClick } from "utils/ga";
import FilterDropdown from "./FilterDropdown";
import { IFilter } from "./types";
import { countActiveFilters } from "./utils";

interface FiltersProps {
  filter: IFilter;
  setFilter: Dispatch<SetStateAction<IFilter>>;
  config: DropdownConfig[];
  options: { [key: string]: keyof typeof Strategy };
}

const Filters: FunctionComponent<FiltersProps> = ({
  filter,
  setFilter,
  config,
  // options,
}) => {
  // const { coinsset } = options;
  const [showMenu, setShowMenu] = useState(false);
  const [temporaryFilter, setTemporaryFilter] = useState(filter);

  const activeFiltersCount = useMemo(
    () => countActiveFilters(filter),
    [filter]
  );
  const applyFilter = () => {
    setFilter(cloneDeep(temporaryFilter));
  };

  return (
    <Dropdown
      overlay={
        <div className="flex w-[25rem] flex-col space-y-4 rounded-sm border border-nodata/20 bg-bgcolor p-4">
          {config.map((c) => (
            <FilterDropdown
              data={c}
              key={c.name}
              filter={temporaryFilter}
              updateFilter={setTemporaryFilter}
              showLabel
              placeholderText={`Choose ${c.name}`}
              // disabledItems={
              //   c.name === 'coins' && coinsset === 'hourly'
              //     ? [Coins.DOGE]
              //     : undefined
              // }
            />
          ))}
          <div className="flex flex-row space-x-2">
            <Button
              text="Apply"
              type={BUTTON_TYPE.FILLED}
              onClick={() => {
                applyFilter();
                setShowMenu(false);
              }}
              className="!w-1/2"
            />
            <Button
              text="Reset"
              type={BUTTON_TYPE.OUTLINED}
              onClick={() => {
                gaClick("reset filter click");
                setFilter(cleanFilter);
                setTemporaryFilter(cloneDeep(cleanFilter));
                setShowMenu(false);
              }}
              className="!w-1/2"
            />
          </div>
        </div>
      }
      trigger={["click"]}
      onVisibleChange={(flag: boolean) => {
        if (!flag) {
          setTemporaryFilter(cloneDeep(filter));
        }
        setShowMenu(flag);
      }}
      visible={showMenu}
      placement={"bottomLeft"}
    >
      <button type="button" className="horos-filter-btn-main group">
        <FilterIcons className="mr-1 h-8 md:h-5" />
        <span className="hidden md:inline-block">
          Filters{" "}
          <span className="text-primary group-hover:text-white">
            {activeFiltersCount ? `(${activeFiltersCount})` : ""}
          </span>
        </span>
      </button>
    </Dropdown>
  );
};

export default Filters;
