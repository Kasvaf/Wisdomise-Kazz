import { Dayjs } from "dayjs";

export type FilterType = {
  [key: string]: boolean | string | Date | Dayjs;
};

export interface IFilter {
  [key: string]: FilterType;
}
