export interface PageResponse<TData> {
  count: number;
  next?: number;
  previous?: number;
  results: TData[];
}
