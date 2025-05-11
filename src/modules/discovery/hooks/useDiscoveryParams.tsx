import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import useIsMobile from 'utils/useIsMobile';
import { AVAILABLE_DETAILS, AVAILABLE_LISTS, AVAILABLE_VIEWS } from '../lib';

export const useDiscoveryParams = () => {
  const isMobile = useIsMobile();
  const [searchParams] = useSearchParams();

  return useMemo(() => {
    const list: (typeof AVAILABLE_LISTS)[number] = AVAILABLE_LISTS.includes(
      searchParams.get('list') as never,
    )
      ? (searchParams.get('list') as (typeof AVAILABLE_LISTS)[number])
      : 'coin-radar';
    const detail: (typeof AVAILABLE_DETAILS)[number] =
      AVAILABLE_DETAILS.includes(searchParams.get('detail') as never)
        ? (searchParams.get('detail') as (typeof AVAILABLE_DETAILS)[number])
        : 'coin';
    const slug: string | undefined = searchParams.get('slug') || undefined;
    const view: (typeof AVAILABLE_VIEWS)[number] = isMobile
      ? slug
        ? 'detail'
        : 'list'
      : AVAILABLE_VIEWS.includes(searchParams.get('view') as never)
      ? (searchParams.get('view') as (typeof AVAILABLE_VIEWS)[number])
      : 'both';

    return {
      list,
      detail,
      slug,
      view,
    };
  }, [isMobile, searchParams]);
};
