export interface PageResponse<TData> {
  count: number;
  next?: number;
  previous?: number;
  results: TData[];
}

export interface PageResponse2<TData> {
  links: {
    next: string | null;
    previous: string | null;
  };
  count: number;
  results: TData[];
}
