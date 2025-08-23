import { useMemo } from 'react';
import { useMatches, useNavigate, useParams } from 'react-router-dom';
import { useSessionStorage } from 'usehooks-ts';
import type { DETAILS, LISTS, VIEWS } from './constants';

export type DiscoveryView = (typeof VIEWS)[number];
export type DiscoveryDetail = (typeof DETAILS)[number];
export type DiscoveryList = (typeof LISTS)[number];
export type DiscoverySlugs = string[];
export type DiscoveryParams = {
  list: DiscoveryList;
  detail: DiscoveryDetail;
  slugs: DiscoverySlugs;
};

export const useDiscoveryView = (): DiscoveryView | undefined => {
  const matches = useMatches();
  return matches[matches.length - 1].id === 'DiscoveryListView'
    ? 'list'
    : matches[matches.length - 1].id === 'DiscoveryDetailView'
      ? 'detail'
      : undefined;
};

export const useDiscoveryParams = () => {
  const view = useDiscoveryView();
  const urlParams = useParams<{
    list: DiscoveryList;
    detail: DiscoveryDetail;
    slug1: string;
    slug2: string;
    slug3: string;
  }>();
  const navigate = useNavigate();
  const [storageParams, setStorageParams] = useSessionStorage<{
    list?: DiscoveryList;
    detail?: DiscoveryDetail;
    slug1?: string;
    slug2?: string;
    slug3?: string;
  }>('discovery-backdrop', {});

  return useMemo(() => {
    const value = (
      view === 'detail'
        ? {
            detail: urlParams.detail,
            slugs: [urlParams.slug1, urlParams.slug2, urlParams.slug3].filter(
              x => !!x,
            ),
            list: storageParams.list,
          }
        : {
            list: urlParams.list,
            detail: storageParams.detail,
            slugs: [
              storageParams.slug1,
              storageParams.slug2,
              storageParams.slug3,
            ].filter(x => !!x),
          }
    ) as Partial<DiscoveryParams>;

    /**
     * @title Internal Method
     * @description You probably don't need this. if you want to navigate to a detail or a list, just use navigate or NavLink.
     */
    const setValue = (
      newValue: Partial<DiscoveryParams>,
      newView: DiscoveryView = view || 'detail',
    ) => {
      setStorageParams({
        ...value,
        ...newValue,
      });
      if (newView === 'detail') {
        navigate(`/${[newValue.detail, ...(newValue.slugs ?? [])].join('/')}`);
      } else {
        navigate(`/${newValue.list}`);
      }
    };

    return [value, setValue] as const;
  }, [view, storageParams, setStorageParams, urlParams, navigate]);
};
