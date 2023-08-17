import { type Dayjs } from 'dayjs';

export type FilterType = Record<string, boolean | string | Date | Dayjs>;
export type IFilter = Record<string, FilterType>;
