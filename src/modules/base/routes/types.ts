import type { ReactNode } from 'react';
import type { Params } from 'react-router-dom';

interface Crumb {
  href: string;
  text: ReactNode;
}

export interface RouteHandle {
  crumb:
    | Crumb
    | Crumb[]
    | ((
        params: Params<string>,
        searchParams: URLSearchParams,
      ) => Crumb | Crumb[]);
}
