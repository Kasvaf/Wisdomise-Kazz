import { useCallback, useMemo } from 'react';
import {
  createSearchParams,
  type To,
  useLocation,
  useSearchParams,
} from 'react-router-dom';
import { DETAILS, LISTS, VIEWS } from './constants';

export interface DiscoveryRouteMeta {
  list: keyof typeof LISTS;
  detail: keyof typeof DETAILS;
  view: keyof typeof VIEWS;
}

export const useDiscoveryRouteMeta = <T extends string>() => {
  const [searchParams] = useSearchParams();
  const { pathname } = useLocation();

  const params = useMemo<DiscoveryRouteMeta>(() => {
    const ui = searchParams.get('ui') ?? '';

    const list: keyof typeof LISTS =
      (Object.entries(LISTS).find(
        ([, v]) => v.alias === ui.slice(0, 1),
      )?.[0] as keyof typeof LISTS) ?? 'coin-radar';

    const detail: keyof typeof DETAILS =
      (Object.entries(DETAILS).find(
        ([, v]) => v.alias === ui.slice(1, 2),
      )?.[0] as keyof typeof DETAILS) ?? 'coin';

    const view: keyof typeof VIEWS =
      (Object.entries(VIEWS).find(
        ([, v]) => v.alias === ui.slice(2, 3),
      )?.[0] as keyof typeof VIEWS) ?? 'both';

    return {
      list,
      detail,
      view,
    };
  }, [searchParams]);

  const getUrl = useCallback(
    ({
      list,
      detail,
      view,
      ...rest
    }: Partial<DiscoveryRouteMeta> & Record<T, string | undefined>): To => {
      const newSearchParams = createSearchParams(
        pathname === '/discovery' ? searchParams : undefined,
      );
      for (const [k, v] of Object.entries(rest ?? {})) {
        if (typeof v === 'string') {
          newSearchParams.set(k, v);
        } else {
          newSearchParams.delete(k);
        }
      }
      newSearchParams.set(
        'ui',
        [
          LISTS[list || params.list].alias,
          DETAILS[detail || params.detail].alias,
          VIEWS[view || params.view].alias,
        ].join(''),
      );
      return {
        pathname: '/discovery',
        search: newSearchParams.toString(),
      };
    },
    [pathname, searchParams, params],
  );

  const isMatched = useCallback(
    (meta: Partial<DiscoveryRouteMeta>): boolean => {
      return Object.entries(meta).every(([key, value]) => {
        if (params[key as never] !== value) return false;
        return true;
      });
    },
    [params],
  );

  return useMemo(
    () => ({ params, getUrl, isMatched }),
    [params, getUrl, isMatched],
  );
};
