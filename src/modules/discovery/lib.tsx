import { useCallback, useMemo } from 'react';
import { useMatches, useNavigate, useParams } from 'react-router-dom';
import { useSessionStorage } from 'usehooks-ts';
import type { DETAILS, LISTS, VIEWS } from './constants';

export type DiscoveryView = (typeof VIEWS)[number];
export type DiscoveryDetail = (typeof DETAILS)[number];
export type DiscoveryList = (typeof LISTS)[number];
export type DiscoverySlug = string[];

export type DiscoveryParams<T = DiscoveryView | never> = T extends 'list'
  ? {
      list: DiscoveryList;
    }
  : T extends 'detail'
    ? {
        detail: DiscoveryDetail;
        slug: DiscoverySlug;
      }
    : {
        list?: DiscoveryList;
        detail?: DiscoveryDetail;
        slug?: DiscoverySlug;
      };

export type SetDiscoveryParams<T = DiscoveryView | never> = (
  newValue: DiscoveryParams<T>,
) => void;

export const useDiscoveryView = (): DiscoveryView | undefined => {
  const matches = useMatches();
  return matches[matches.length - 1].id === 'DiscoveryListView'
    ? 'list'
    : matches[matches.length - 1].id === 'DiscoveryDetailView'
      ? 'detail'
      : undefined;
};

export function useDiscoveryBackdropParams(): [
  DiscoveryParams<any>,
  SetDiscoveryParams<any>,
] {
  return useSessionStorage<DiscoveryParams<unknown>>('discovery-backdrop', {
    detail: 'token',
    list: 'trench',
    slug: [],
  } as never);
}

export function useDiscoveryParams<T = DiscoveryView>(): [
  DiscoveryParams<T>,
  SetDiscoveryParams<T>,
] {
  const navigate = useNavigate();
  const rawParams = useParams<{
    list: DiscoveryList;
    detail: DiscoveryDetail;
    param1: string;
    param2: string;
    param3: string;
  }>();
  const view = useDiscoveryView();

  const valueAsDetail = useMemo<DiscoveryParams<'detail'>>(() => {
    return {
      detail: rawParams.detail ?? 'token',
      slug: [rawParams.param1, rawParams.param2, rawParams.param3].filter(
        x => !!x,
      ) as DiscoverySlug,
    };
  }, [rawParams.detail, rawParams.param1, rawParams.param2, rawParams.param3]);

  const valueAsList = useMemo<DiscoveryParams<'list'>>(() => {
    return {
      list: rawParams.list ?? 'trench',
    };
  }, [rawParams.list]);

  const setValueAsDetail = useCallback(
    (newValue: DiscoveryParams<'detail'>) => {
      navigate(`/${newValue.detail}/${newValue.slug.join('/')}`);
    },
    [navigate],
  );

  const setValueAsList = useCallback(
    (newValue: DiscoveryParams<'list'>) => {
      navigate(`/${newValue.list}`);
    },
    [navigate],
  );

  return useMemo(
    () =>
      (view === 'detail'
        ? [valueAsDetail, setValueAsDetail]
        : [valueAsList, setValueAsList]) as never,
    [view, valueAsDetail, valueAsList, setValueAsDetail, setValueAsList],
  );
}
