import { type FetchOptions, type FetchRequest } from 'ofetch';
import { ofetch } from 'config/ofetch';
import { type PageResponse2, type PageResponse } from './types/page';

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
