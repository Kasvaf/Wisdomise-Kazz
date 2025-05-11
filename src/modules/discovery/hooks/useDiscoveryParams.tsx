import { useMemo } from 'react';
import { usePageState } from 'shared/usePageState';
import useIsMobile from 'utils/useIsMobile';
import { AVAILABLE_DETAILS, AVAILABLE_RADARS, AVAILABLE_VIEWS } from '../lib';

export const useDiscoveryParams = () => {
  const isMobile = useIsMobile();
  const [params, setParams] = usePageState<{
    detail: string;
    radar: string;
    view: string;
    slug: string;
  }>('', {
    detail: '',
    radar: '',
    view: '',
    slug: '',
  });

  return useMemo(() => {
    const radar: (typeof AVAILABLE_RADARS)[number] = AVAILABLE_RADARS.includes(
      params.radar as never,
    )
      ? (params.radar as (typeof AVAILABLE_RADARS)[number])
      : 'coin';
    const detail: (typeof AVAILABLE_DETAILS)[number] =
      AVAILABLE_DETAILS.includes(params.detail as never)
        ? (params.detail as (typeof AVAILABLE_DETAILS)[number])
        : 'coin';
    const slug: string | undefined = params.slug || undefined;
    const view: (typeof AVAILABLE_VIEWS)[number] = isMobile
      ? slug
        ? 'detail'
        : 'radar'
      : AVAILABLE_VIEWS.includes(params.view as never)
      ? (params.view as (typeof AVAILABLE_VIEWS)[number])
      : 'both';

    return [
      {
        radar,
        detail,
        slug,
        view,
      },
      setParams,
    ] as const;
  }, [
    isMobile,
    params.detail,
    params.radar,
    params.slug,
    params.view,
    setParams,
  ]);
};
