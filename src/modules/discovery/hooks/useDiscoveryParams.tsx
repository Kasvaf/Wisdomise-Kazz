import { useMemo } from 'react';
import { usePageState } from 'shared/usePageState';
import useIsMobile from 'utils/useIsMobile';
import { AVAILABLE_DETAILS, AVAILABLE_LISTS, AVAILABLE_VIEWS } from '../lib';

export const useDiscoveryParams = () => {
  const isMobile = useIsMobile();
  const [params, setParams] = usePageState<{
    detail: string;
    list: string;
    view: string;
    slug: string;
  }>('', {
    detail: '',
    list: '',
    view: '',
    slug: '',
  });

  return useMemo(() => {
    const list: (typeof AVAILABLE_LISTS)[number] = AVAILABLE_LISTS.includes(
      params.list as never,
    )
      ? (params.list as (typeof AVAILABLE_LISTS)[number])
      : 'coin-radar';
    const detail: (typeof AVAILABLE_DETAILS)[number] =
      AVAILABLE_DETAILS.includes(params.detail as never)
        ? (params.detail as (typeof AVAILABLE_DETAILS)[number])
        : 'coin';
    const slug: string | undefined = params.slug || undefined;
    const view: (typeof AVAILABLE_VIEWS)[number] = isMobile
      ? slug
        ? 'detail'
        : 'list'
      : AVAILABLE_VIEWS.includes(params.view as never)
      ? (params.view as (typeof AVAILABLE_VIEWS)[number])
      : 'both';

    return [
      {
        list,
        detail,
        slug,
        view,
      },
      setParams,
    ] as const;
  }, [
    isMobile,
    params.detail,
    params.list,
    params.slug,
    params.view,
    setParams,
  ]);
};
