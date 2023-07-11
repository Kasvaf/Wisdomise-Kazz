import { ReactComponent as ChevronDown } from "@images/chevron-down.svg";
import { Dropdown } from "antd";
import dayjs, { Dayjs } from "dayjs";
import { cloneDeep, isArray } from "lodash";
import { Dispatch, SetStateAction, useMemo, useState } from "react";
import { DateRange, Range } from "react-date-range";
import { gaClick } from "utils/ga";
import {
  Coins,
  FilterDropdownsConfig,
  FilterNames,
  Strategy,
} from "./constants";
import { IFilter } from "./types";

type DisableItemType = keyof typeof Coins | keyof typeof Strategy;

interface FilterDropdownProps {
  data: (typeof FilterDropdownsConfig)[keyof typeof FilterDropdownsConfig];
  updateFilter: Dispatch<SetStateAction<IFilter>>;
  filter: IFilter;
  className?: string;
  showLabel?: boolean;
  placeholderText?: string;
  minDate?: Date;
  maxDate?: Date;
  placement?:
    | "bottomRight"
    | "topLeft"
    | "topCenter"
    | "topRight"
    | "bottomLeft"
    | "bottomCenter"
    | "top"
    | "bottom"
    | undefined;
  disabledItems?: DisableItemType[];
}

const filterToSelectionRange = (filter: {
  [key: string]: Date | boolean | string | Dayjs;
}) => ({
  startDate: (filter["start"] as Date) || new Date(),
  endDate: (filter["end"] as Date) || new Date(),
});

function FilterDropdown({
  data,
  updateFilter,
  filter,
  className,
  showLabel,
  placeholderText,
  minDate,
  maxDate,
  placement,
  disabledItems,
}: FilterDropdownProps) {
  const { name, label, type, options } = data;
  const [showMenu, setShowMenu] = useState(false);

  const handleFilterChange = (value: string) => {
    const newFilter = cloneDeep(filter);
    if (type === "singleselect") {
      newFilter[name] = { [value]: newFilter[name][value] };
      newFilter[name][value] = true;
      setShowMenu(false);
    } else {
      newFilter[name][value] = !newFilter[name][value];
    }
    if (name === "strategy") {
      newFilter["coins"] = {};
    }
    updateFilter(newFilter);
  };

  const handleDateSelect = (ranges: { [key: string]: Range }) => {
    const newFilter = cloneDeep(filter);
    if (!ranges.range1.startDate) return;
    newFilter[name] = {
      start: ranges.range1.startDate,
      end: ranges.range1.endDate || ranges.range1.startDate,
    };
    updateFilter(newFilter);
  };

  const activeFilterCount = useMemo(() => {
    let count = 0;
    Object.keys(filter[name]).forEach((fValue) => {
      const val = filter[name][fValue];
      if (isArray(val)) {
        if (val.length > 0) count++;
      } else {
        if (val) count++;
      }
    });
    return count;
  }, [filter, name]);

  const isDisabled = (o: DisableItemType) =>
    (name === FilterNames.coins || name === FilterNames.strategy) &&
    disabledItems &&
    disabledItems.includes(o);

  const renderLabel = () => {
    return showLabel
      ? activeFilterCount
        ? Object.keys(filter[name])
            .filter((item) => filter[name][item])
            .map((item) => {
              return type === "date"
                ? dayjs(filter[name][item] as Date).format("DD/MM/YYYY")
                : item;
            })
            .join(type === "date" ? "-" : ", ")
        : placeholderText
      : label;
  };

  return (
    <Dropdown
      overlay={
        <div
          className={`mt-1 flex max-h-64 w-full min-w-[300px] flex-col overflow-y-auto rounded-sm border border-nodata/20 bg-bgcolor p-4 ${
            type === "date" ? "max-h-full py-2" : ""
          }`}
        >
          {(type === "singleselect" || type === "multiselect") &&
            options !== null &&
            Object.keys(options)
              .sort((a, b) =>
                disabledItems
                  ? disabledItems.includes(b as DisableItemType)
                    ? -1
                    : 1
                  : 1
              )
              .map((o) => (
                <button
                  className={`horos-dropdown-item ${
                    filter[name][o] ? "text-primary" : ""
                  }`}
                  key={o}
                  onClick={() => {
                    gaClick("filter" + name + " option " + o + " click");
                    handleFilterChange(o);
                  }}
                  disabled={isDisabled(o as keyof typeof Coins)}
                >
                  {type === "multiselect" && (
                    <input
                      type="checkbox"
                      className="horos-checkbox mr-2"
                      name="privacyPolicy"
                      checked={!!filter[name][o]}
                      readOnly
                    />
                  )}
                  <span className="uppercase">
                    {o}{" "}
                    {isDisabled(o as keyof typeof Coins) && (
                      <span className="text-white/60">(SOON)</span>
                    )}
                  </span>
                </button>
              ))}
          {/* {type === 'multiselect' &&
            options !== null &&
            Object.keys(options).map((o) => (
              <div
                className={`horos-dropdown-item ${
                  filter[name][o] ? 'text-primary' : ''
                }`}
                key={o}
                onClick={() => handleFilterChange(o)}
              >
                <span className="uppercase">{o}</span>
              </div>
            ))} */}
          {type === "date" && (
            <DateRange
              moveRangeOnFirstSelection={false}
              ranges={[filterToSelectionRange(filter[name])]}
              onChange={handleDateSelect}
              rangeColors={["#e26cff"]}
              minDate={minDate}
              maxDate={maxDate || new Date()}
              shownDate={new Date()}
              showMonthAndYearPickers={false}
              showPreview={true}
              showDateDisplay={false}
            />
          )}
        </div>
      }
      trigger={["click"]}
      onVisibleChange={(flag: boolean) => setShowMenu(flag)}
      visible={showMenu}
      placement={placement || "bottomRight"}
    >
      <button
        className={`horos-filter-btn-alt group relative h-16 fill-white/50 px-4 capitalize hover:bg-gray-dark hover:fill-white hover:text-white ${className}`}
      >
        {showLabel && (
          <div className="absolute left-4 top-3 text-xs text-nodata">
            {label}
          </div>
        )}
        <div
          className={`whitespace-nowrap text-left text-sm ${
            showLabel ? "mt-5  capitalize text-white" : ""
          }`}
        >
          {renderLabel()}
          {!showLabel && activeFilterCount ? (
            <span className="text-primary"> ({activeFilterCount})</span>
          ) : (
            ""
          )}
        </div>
        <ChevronDown className="w-6" />
      </button>
    </Dropdown>
  );
}

export default FilterDropdown;
