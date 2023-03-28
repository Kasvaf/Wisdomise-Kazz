import { Signal } from 'api/types/signal';
import dayjs from 'dayjs';
import { isArray } from 'lodash';
import { FilterType, IFilter } from './types';
import isBetween from 'dayjs/plugin/isBetween';
dayjs.extend(isBetween);

export const countActiveFilters = (filter: IFilter) => {
  let count = 0;
  Object.keys(filter).forEach((f) => {
    if (f === 'date') {
      if (filter[f]['start']) count++;
      return;
    }
    Object.keys(filter[f]).forEach((fValue) => {
      const val = filter[f][fValue];
      if (isArray(val)) {
        if (val.length > 0) count++;
      } else {
        if (val) count++;
      }
    });
  });
  return count;
};

export const filterProcessor =
  (filterKey: keyof Signal) => (items: Signal[], filters: FilterType) => {
    let newItems: Signal[] = [];
    let hasFilters = false;
    Object.keys(filters).forEach((key) => {
      if (filters[key]) {
        hasFilters = true;
        newItems = newItems.concat(
          items.filter(
            (item) =>
              item[filterKey] === (filterKey === 'pair' ? key + 'USDT' : key),
          ),
        );
      }
    });
    return hasFilters ? newItems : items;
  };

export const dateFilterProcessor =
  (filterKey: keyof Signal) => (items: Signal[], filters: FilterType) => {
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
