import { Signal } from "api/types/signal";
import { FilterType } from "./types";
import { dateFilterProcessor, filterProcessor } from "./utils";

export enum FilterNames {
  side = "side",
  status = "status",
  coins = "coins",
  date = "date",
  strategy = "strategy",
  benchmark = "benchmark",
  risk = "risk",
}

export const Status = {
  OPEN: "OPEN",
  CLOSE: "CLOSE",
  WEAK: "WEAK",
};

export const Side = {
  LONG: "long",
  SHORT: "short",
};

export const Coins = {
  BTC: "BTC",
  ETH: "ETH",
  BNB: "BNB",
  XRP: "XRP",
  ADA: "ADA",
  TRX: "TRX",
  LTC: "LTC",
} as const;

export const Strategy = {
  hourly: "hourly",
  hft: "hft",
} as const;

export const Benchmark = {
  BTC: "BTC Hold",
  ETH: "ETH Hold",
  TRX: "TRX Hold",
  BNB: "BNB Hold",
  XRP: "XRP Hold",
  ADA: "ADA Hold",
  LTC: "LTC Hold",
};

export const Risk = {
  low: "Low risk",
  medium: "Medium risk",
  high: "High risk",
};

interface DropdownConfig {
  name: FilterNames;
  label: string;
  type: "singleselect" | "multiselect" | "date";
  options: { [key: string]: string } | null;
  filter: (items: Signal[], filters: FilterType) => Signal[];
}

export const FilterDropdownsConfig: { [key in FilterNames]: DropdownConfig } = {
  [FilterNames.side]: {
    name: FilterNames.side,
    label: "Side",
    type: "multiselect",
    options: Side,
    filter: filterProcessor("side"),
  },
  [FilterNames.status]: {
    name: FilterNames.status,
    label: "Status",
    type: "multiselect",
    options: Status,
    filter: filterProcessor("status"),
  },
  [FilterNames.coins]: {
    name: FilterNames.coins,
    label: "Coin",
    type: "singleselect",
    options: Coins,
    filter: filterProcessor("pair"),
  },
  [FilterNames.date]: {
    name: FilterNames.date,
    label: "Date From/To",
    type: "date",
    filter: dateFilterProcessor("created_at"),
    options: null,
  },
  [FilterNames.strategy]: {
    name: FilterNames.strategy,
    label: "Strategy",
    type: "singleselect",
    options: Strategy,
    filter: filterProcessor("pair"), // TODO: update those
  },
  [FilterNames.benchmark]: {
    name: FilterNames.benchmark,
    label: "Benchmark",
    type: "singleselect",
    options: Benchmark,
    filter: filterProcessor("pair"), // TODO: update those
  },
  [FilterNames.risk]: {
    name: FilterNames.risk,
    label: "HOROS SPO",
    type: "singleselect",
    options: Risk,
    filter: filterProcessor("pair"), // TODO: update those
  },
};
