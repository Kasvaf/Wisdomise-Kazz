import type { NetworkSecurity } from 'api/discovery';
import type { PageResponse, PageResponse2 } from 'api/types/page';
import type { Coin } from 'api/types/shared';
import { ofetch } from 'config/ofetch';
import type { FetchOptions, FetchRequest } from 'ofetch';

export function resolvePageResponseToArray<T>(
  request: FetchRequest,
  options?:
    | FetchOptions<'json', PageResponse<T> | PageResponse2<T>>
    | undefined,
  resolveOptions?: {
    limit?: number;
  },
) {
  const getRecursive = async (page: number, results: T[] = []) => {
    const newResp = await ofetch<PageResponse<T> | PageResponse2<T> | T[]>(
      request,
      {
        ...options,
        query: {
          ...options?.query,
          page,
        },
      },
    );
    if ('results' in newResp) {
      const lastResults = [...results, ...newResp.results];
      if (
        (('links' in newResp && newResp.links.next) ||
          ('next' in newResp && newResp.next)) &&
        lastResults.length < (resolveOptions?.limit ?? Number.POSITIVE_INFINITY)
      ) {
        return await getRecursive(page + 1, lastResults);
      }
      return lastResults;
    }
    return newResp;
  };

  return getRecursive(1, []);
}

export const matcher = (search: string | string[] | null | undefined) => {
  const searchArray = search ? (Array.isArray(search) ? search : [search]) : [];
  const searchString = search
    ? Array.isArray(search)
      ? search.join('').toLowerCase()
      : search.trim().toLowerCase()
    : '';
  const string = (source?: string | null | undefined) => {
    if (!source && searchString) return false;
    if (source && searchString && !source.toLowerCase().includes(searchString))
      return false;
    return true;
  };

  const coin = (source: Coin | null | undefined) => {
    if (!source && searchString) return false;
    if (
      source &&
      searchString &&
      ![source.name, source.abbreviation]
        .filter(x => !!x)
        .join('-')
        .toLowerCase()
        .includes(searchString)
    )
      return false;
    return true;
  };

  const array = (source: string[] | null | undefined) => {
    const sourceArray = source || [];
    if (sourceArray.length === 0 && searchArray.length > 0) return false;
    if (
      sourceArray.length > 0 &&
      searchArray.length > 0 &&
      !sourceArray.some(x => searchArray.includes(x))
    )
      return false;
    return true;
  };

  const security = (source: NetworkSecurity[] | null | undefined) => {
    const sourceArray = source || [];
    const sourceLabels = [
      ...(sourceArray.every(x => !!x.label.trusted) ? ['trusted'] : []),
      ...(sourceArray.some(x => (x.label.warning ?? 0) > 0) ? ['warning'] : []),
      ...(sourceArray.some(x => (x.label.risk ?? 0) > 0) ? ['risk'] : []),
    ];
    if (
      searchArray.length > 0 &&
      !sourceLabels.some(x => searchArray.includes(x))
    )
      return false;
    return true;
  };

  return {
    string,
    coin,
    array,
    security,
  };
};

export const createSorter = (
  order: 'ascending' | 'descending' | null | undefined,
) => {
  const multiplyBy = order === 'descending' ? -1 : 1;
  const getVal = (val: string | number | null | undefined) => {
    if (val === undefined || !val) return 0;
    if (typeof val === 'string') {
      const asDate = new Date(val).getTime();
      return Number.isNaN(asDate) ? Date.now() : asDate;
    }
    return val;
  };
  return (
    a: string | number | null | undefined,
    b: string | number | null | undefined,
  ) => (getVal(a) - getVal(b)) * multiplyBy;
};
