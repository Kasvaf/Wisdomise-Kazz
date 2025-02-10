import { type FetchOptions, type FetchRequest } from 'ofetch';
import { ofetch } from 'config/ofetch';
import { type PageResponse } from './types/page';

export function resolvePageResponseToArray<T>(
  request: FetchRequest,
  options?: FetchOptions<'json', PageResponse<T>> | undefined,
) {
  const getRecursive = async (page: number, results: T[] = []) => {
    const newResp = await ofetch<PageResponse<T>>(request, {
      ...options,
      query: {
        ...options?.query,
        page,
      },
    });
    const lastResults = [...results, ...newResp.results];
    if (newResp.next) {
      return await getRecursive(page + 1, lastResults);
    }
    return lastResults;
  };

  return getRecursive(1, []);
}
