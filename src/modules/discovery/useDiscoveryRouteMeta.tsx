import { useCallback, useMemo } from 'react';
import {
  createSearchParams,
  type To,
  useLocation,
  useSearchParams,
} from 'react-router-dom';
import useIsMobile from 'utils/useIsMobile';
import {
  AVAILABLE_DETAILS,
  AVAILABLE_LISTS,
  AVAILABLE_VIEWS,
} from './constants';

export interface DiscoveryRouteMeta {
  list: (typeof AVAILABLE_LISTS)[number];
  detail: (typeof AVAILABLE_DETAILS)[number];
  view: (typeof AVAILABLE_VIEWS)[number];
  slug?: string;
}

export const useDiscoveryRouteMeta = <T extends string>() => {
  const isMobile = useIsMobile();
  const [searchParams] = useSearchParams();
  const { pathname } = useLocation();

  const getUrl = useCallback(
    (meta: Partial<DiscoveryRouteMeta> & Record<T, string>): To => {
      if (Object.keys(meta).length === 0) {
        throw new Error('unexpected');
      }
      const newSearchParams = createSearchParams(
        pathname === '/discovery' ? searchParams : undefined,
      );
      for (const [key, value] of Object.entries(meta)) {
        if (value) {
          newSearchParams.set(key, value);
        } else {
          newSearchParams.delete(key);
        }
      }
      return {
        pathname: '/discovery',
        search: newSearchParams.toString(),
      };
    },
    [pathname, searchParams],
  );

  const isMatched = useCallback(
    (meta: Partial<DiscoveryRouteMeta>): boolean => {
      return Object.entries(meta).every(([key, value]) => {
        if (searchParams.get(key) !== value) return false;
        return true;
      });
    },
    [searchParams],
  );

  const params = useMemo<DiscoveryRouteMeta>(() => {
    const requestedList: (typeof AVAILABLE_LISTS)[number] | undefined = (() => {
      const v = searchParams.get('list');
      if (AVAILABLE_LISTS.includes(v as never)) {
        return v as (typeof AVAILABLE_LISTS)[number];
      }
    })();

    const requestedDetail: (typeof AVAILABLE_DETAILS)[number] | undefined =
      (() => {
        const v = searchParams.get('detail');
        if (AVAILABLE_DETAILS.includes(v as never)) {
          return v as (typeof AVAILABLE_DETAILS)[number];
        }
      })();

    const slug = searchParams.get('slug') ?? undefined;

    const requestedView: (typeof AVAILABLE_VIEWS)[number] | undefined = (() => {
      const v = searchParams.get('view');
      if (AVAILABLE_VIEWS.includes(v as never)) {
        return v as (typeof AVAILABLE_VIEWS)[number];
      }
    })();

    const list: (typeof AVAILABLE_LISTS)[number] =
      requestedList ?? 'coin-radar';

    const view: (typeof AVAILABLE_VIEWS)[number] = isMobile
      ? requestedDetail && slug && requestedView !== 'list'
        ? 'detail'
        : 'list'
      : requestedView || (slug ? 'both' : 'list');

    const detail: (typeof AVAILABLE_DETAILS)[number] = slug
      ? requestedDetail ?? 'coin'
      : 'coin';

    return {
      list,
      detail,
      slug,
      view,
    };
  }, [searchParams, isMobile]);

  return useMemo(
    () => ({ params, getUrl, isMatched }),
    [params, getUrl, isMatched],
  );
};
