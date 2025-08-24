import { bxChevronLeft, bxChevronRight } from 'boxicons-quasar';
import { useEffect, useMemo, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Icon from 'shared/Icon';
import { Button } from 'shared/v1-components/Button';
import { useSessionStorage } from 'usehooks-ts';
import useIsMobile from 'utils/useIsMobile';
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

/**
 * @title Internal Method
 */
export const useDiscoveryBackdropParams = () => {
  const [storageParams, setStorageParams] = useSessionStorage<{
    list?: DiscoveryList;
    detail?: DiscoveryDetail;
    slug1?: string;
    slug2?: string;
    slug3?: string;
  }>('discovery', {});

  return useMemo(() => {
    return [
      {
        detail: storageParams.detail,
        list: storageParams.list,
        slugs: [
          storageParams.slug1,
          storageParams.slug2,
          storageParams.slug3,
        ].filter(x => !!x) as string[],
      } satisfies Partial<DiscoveryParams>,
      (newValue: Partial<DiscoveryParams>) => {
        setStorageParams({
          ...storageParams,
          ...newValue,
        });
      },
    ] as const;
  }, [storageParams, setStorageParams]);
};

/**
 * @title Internal Method
 */
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

export const useDiscoveryParams = () => {
  const urlParams = useDiscoveryUrlParams();
  const [backdropParams] = useDiscoveryBackdropParams();
  return useMemo(() => {
    const value: Partial<DiscoveryParams> = {
      list: urlParams.list ?? backdropParams.list,
      detail: urlParams.detail ?? backdropParams.detail,
      slugs: urlParams.slugs?.length
        ? urlParams.slugs
        : backdropParams.slugs.length
          ? backdropParams.slugs
          : [],
    };

    return value;
  }, [
    backdropParams.detail,
    backdropParams.list,
    backdropParams.slugs,
    urlParams.detail,
    urlParams.list,
    urlParams.slugs,
  ]);
};

/**
 * @title Internal Component
 */
export const DiscoveryExpandCollapser = () => {
  const urlParams = useDiscoveryUrlParams();
  const [backdropParams, setBackdropParams] = useDiscoveryBackdropParams();
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const ref = useRef<HTMLDivElement>(null);
  const lastList = useRef<DiscoveryList>('trench');

  useEffect(() => {
    if (!ref.current) return;
    const headerHeight = 48;
    const sidebarWidth = 74;
    const compactListWidth = 288;

    if (urlParams.detail && !backdropParams.list) {
      ref.current.style.top = `${headerHeight + 10}px`;
      ref.current.style.left = `${sidebarWidth - 20}px`;
      ref.current.style.right = `auto`;
    } else if (urlParams.detail && backdropParams.list) {
      ref.current.style.top = `${headerHeight + 10}px`;
      ref.current.style.left = `${sidebarWidth + compactListWidth - 20}px`;
      ref.current.style.right = `auto`;
    } else if (urlParams.list) {
      ref.current.style.top = `${headerHeight + 10}px`;
      ref.current.style.left = `auto`;
      ref.current.style.right = `0`;
    }
  }, [urlParams.detail, backdropParams.list, urlParams.list]);

  const handleExpandClick = () => {
    if (backdropParams.list) {
      setBackdropParams(urlParams);
      navigate(`/${backdropParams.list}`);
    } else {
      setBackdropParams({
        list: lastList.current,
      });
    }
  };

  const handleCollapseClick = () => {
    if (urlParams.list && backdropParams.detail) {
      setBackdropParams(urlParams);
      navigate(
        `/${[backdropParams.detail, ...backdropParams.slugs].join('/')}`,
      );
    } else if (urlParams.detail && backdropParams.list) {
      lastList.current = backdropParams.list;
      setBackdropParams({
        list: undefined,
      });
    }
  };

  if (isMobile) return null;

  return (
    <div className="fixed z-30 flex flex-col items-center gap-1" ref={ref}>
      {urlParams.detail && (
        <Button
          className="rounded-full"
          fab
          onClick={handleExpandClick}
          size="3xs"
          surface={1}
          variant="outline"
        >
          <Icon name={bxChevronRight} />
        </Button>
      )}
      {((urlParams.detail && backdropParams.list) ||
        (urlParams.list && backdropParams.detail)) && (
        <Button
          className="rounded-full"
          fab
          onClick={handleCollapseClick}
          size="3xs"
          surface={1}
          variant="outline"
        >
          <Icon name={bxChevronLeft} />
        </Button>
      )}
    </div>
  );
};
