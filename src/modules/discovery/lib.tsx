import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
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

export const useDiscoveryListPopups = () => {
  const [storageParams, setStorageParams] = useSessionStorage<
    Pick<DiscoveryParams, 'list'>[]
  >('discovery-popups', []);

  return useMemo(() => {
    const value = storageParams.map(
      p =>
        ({
          list: p.list,
        }) satisfies Pick<DiscoveryParams, 'list'>,
    );

    const toggle = (newValue: Pick<DiscoveryParams, 'list'>) => {
      setStorageParams(p => {
        if (p.some(x => x.list === newValue.list)) {
          return p.filter(x => x.list !== newValue.list);
        }
        return [
          ...p,
          {
            list: newValue.list,
          },
        ];
      });
    };

    return [value, toggle] as const;
  }, [storageParams, setStorageParams]);
};

export const useDiscoveryUrlParams = (): Partial<DiscoveryParams> => {
  const nativeParams = useParams<{
    list: DiscoveryList;
    detail: DiscoveryDetail;
    slug1: string;
    slug2: string;
    slug3: string;
  }>();
  return {
    list: nativeParams.list,
    detail: nativeParams.detail,
    slugs: [nativeParams.slug1, nativeParams.slug2, nativeParams.slug3].filter(
      x => !!x,
    ) as string[],
  };
};
