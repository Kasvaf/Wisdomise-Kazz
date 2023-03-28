import {
  DropdownConfig,
  FilterDropdownsConfig,
  FilterNames,
} from "containers/dashboard/common/Filters/constants";
import { IFilter } from "containers/dashboard/common/Filters/types";

// import dayjs from 'dayjs';

export const cleanFilter: IFilter = {
  [FilterNames.status]: { OPEN: true, CLOSE: true },
  [FilterNames.side]: {},
  [FilterNames.coins]: {},
};

export const config: DropdownConfig[] = [
  FilterDropdownsConfig.status,
  FilterDropdownsConfig.side,
  { ...FilterDropdownsConfig.coins, type: "multiselect" },
];
