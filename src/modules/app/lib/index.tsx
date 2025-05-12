import { useCallback, useEffect, useMemo } from 'react';
import {
  createSearchParams,
  type To,
  useLocation,
  useNavigate,
  useSearchParams,
} from 'react-router-dom';
import useIsMobile from 'utils/useIsMobile';

export const AVAILABLE_LISTS = [
  'portfolio',
  'coin-radar',
  'network-radar',
  'social-radar',
  'technical-radar',
  'whale-radar',
] as const;

export const AVAILABLE_DETAILS = ['coin', 'whale'] as const;

export const AVAILABLE_VIEWS = ['detail', 'list', 'both'] as const;

export interface AppRouteMeta {
  list: (typeof AVAILABLE_LISTS)[number];
  detail: (typeof AVAILABLE_DETAILS)[number];
  view: (typeof AVAILABLE_VIEWS)[number];
  slug?: string;
}

export const useAppRouteMeta = (normalizeRoute?: boolean) => {
  const isMobile = useIsMobile();
  const [searchParams] = useSearchParams();
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const getUrl = useCallback(
    (meta: Partial<AppRouteMeta>): To => {
      if (Object.keys(meta).length === 0) {
        throw new Error('unexpected');
      }
      const newSearchParams = createSearchParams(
        pathname.startsWith('/app') ? searchParams : undefined,
      );
      for (const [key, value] of Object.entries(meta)) {
        if (value) {
          newSearchParams.set(key, value);
        } else {
          newSearchParams.delete(key);
        }
      }
      return {
        pathname: '/app',
        search: newSearchParams.toString(),
      };
    },
    [pathname, searchParams],
  );

  const isMatched = useCallback(
    (meta: Partial<AppRouteMeta>): boolean => {
      return Object.entries(meta).every(([key, value]) => {
        if (searchParams.get(key) !== value) return false;
        return true;
      });
    },
    [searchParams],
  );

  const params = useMemo<AppRouteMeta>(() => {
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
      ? requestedDetail && slug
        ? 'detail'
        : 'list'
      : requestedView || 'both';

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

  useEffect(() => {
    if (!normalizeRoute) return;
    if (
      JSON.stringify({
        list: searchParams.get('list'),
        detail: searchParams.get('detail'),
        view: searchParams.get('view'),
        slug: searchParams.get('slug'),
      }) !==
      JSON.stringify({
        list: params.list,
        detail: params.detail,
        view: params.view,
        slug: params.slug,
      })
    ) {
      navigate(getUrl(params), {
        preventScrollReset: true,
        replace: true,
      });
    }
  }, [searchParams, normalizeRoute, params, navigate, getUrl]);

  return useMemo(
    () => ({ params, getUrl, isMatched }),
    [params, getUrl, isMatched],
  );
};
