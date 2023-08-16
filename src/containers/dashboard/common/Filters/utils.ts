import { Signal } from "api/types/signal";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import { FilterType } from "./types";
dayjs.extend(isBetween);

export const filterProcessor = (filterKey: keyof Signal) => (items: Signal[], filters: FilterType) => {
  let newItems: Signal[] = [];
  let hasFilters = false;
  Object.keys(filters).forEach((key) => {
    if (filters[key]) {
      hasFilters = true;
      newItems = newItems.concat(
        items.filter((item) => item[filterKey] === (filterKey === "pair" ? key + "USDT" : key))
      );
    }
  });
  return hasFilters ? newItems : items;
};

export const dateFilterProcessor = (filterKey: keyof Signal) => (items: Signal[], filters: FilterType) => {
  const hasFilters = filters.start && filters.end;
  return hasFilters
    ? items.filter((item) => {
        const date = dayjs((item[filterKey] as number) * 1000);
        const startDate = dayjs(filters.start as Date);
        const endDate = dayjs(filters.end as Date);

        return date.isBetween(startDate, endDate);
      })
    : items;
};
