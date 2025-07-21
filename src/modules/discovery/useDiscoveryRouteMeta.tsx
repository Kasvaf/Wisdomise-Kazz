import { useCallback, useMemo } from 'react';
import {
  createSearchParams,
  type To,
  type URLSearchParamsInit,
  useLocation,
  useSearchParams,
} from 'react-router-dom';
import useIsMobile from 'utils/useIsMobile';
import { DETAILS, LISTS, VIEWS } from './constants';

export interface DiscoveryRouteMeta {
  list: keyof typeof LISTS;
  detail: keyof typeof DETAILS;
  view: keyof typeof VIEWS;
  slug?: string;
}

export const createDiscoverySearchParams = (
  meta: Partial<DiscoveryRouteMeta>,
  init?: URLSearchParamsInit,
) => {
  const searchParams = createSearchParams(init);
  searchParams.set(
    'ui',
    [
      LISTS[meta.list || 'coin-radar'].alias,
      DETAILS[meta.detail || 'coin'].alias,
      VIEWS[meta.view || 'both'].alias,
    ].join(''),
  );
  searchParams.delete('list');
  searchParams.delete('detail');
  searchParams.delete('view');
  if (meta.slug) {
    searchParams.set('slug', meta.slug);
  }
  return searchParams;
};

export const parseDiscoverySearchParams = (
  searchParams: URLSearchParams,
): DiscoveryRouteMeta => {
  const ui = searchParams.get('ui');
  const slug = searchParams.get('slug') || undefined;

  const list: keyof typeof LISTS =
    (searchParams.get('list') as never) ??
    (Object.entries(LISTS).find(
      ([, v]) => v.alias === ui?.slice(0, 1),
    )?.[0] as keyof typeof LISTS) ??
    'coin-radar';

  const detail: keyof typeof DETAILS =
    (searchParams.get('detail') as never) ??
    (Object.entries(DETAILS).find(
      ([, v]) => v.alias === ui?.slice(1, 2),
    )?.[0] as keyof typeof DETAILS) ??
    'coin';

  const view: keyof typeof VIEWS =
    (searchParams.get('view') as never) ??
    (Object.entries(VIEWS).find(
      ([, v]) => v.alias === ui?.slice(2, 3),
    )?.[0] as keyof typeof VIEWS) ??
    'both';

  return {
    list,
    detail,
    view,
    ...(slug ? { slug } : {}),
  };
};

export const useDiscoveryRouteMeta = <T extends string>() => {
  const [searchParams] = useSearchParams();
  const { pathname } = useLocation();
  const isMobile = useIsMobile();

  const params = useMemo<DiscoveryRouteMeta>(() => {
    const ret = parseDiscoverySearchParams(searchParams);
    if (!ret.slug) {
      ret.view = 'list';
    }
    if (ret.slug && ret.view === 'both' && isMobile) {
      ret.view = 'detail';
    }
    return ret;
  }, [isMobile, searchParams]);

  const getUrl = useCallback(
    ({
      list,
      detail,
      view,
      slug,
      ...rest
    }: Partial<DiscoveryRouteMeta> & Record<T, string | undefined>): To => {
      const newSearchParams = createDiscoverySearchParams(
        {
          list: list ?? params.list,
          detail: detail ?? params.detail,
          view: view ?? params.view,
          slug: slug ?? params.slug,
        },
        pathname === '/discovery' ? searchParams : undefined,
      );
      for (const [k, v] of Object.entries(rest ?? {})) {
        if (typeof v === 'string') {
          newSearchParams.set(k, v);
        } else {
          newSearchParams.delete(k);
        }
      }
      return {
        pathname: '/discovery',
        search: newSearchParams.toString(),
      };
    },
    [pathname, searchParams, params],
  );

  const isMatched = useCallback(
    (meta: Partial<DiscoveryRouteMeta>): boolean => {
      if (pathname !== '/discovery') return false;
      return Object.entries(meta).every(([key, value]) => {
        if (params[key as never] !== value) return false;
        return true;
      });
    },
    [params, pathname],
  );

  return useMemo(
    () => ({ params, getUrl, isMatched }),
    [params, getUrl, isMatched],
  );
};
