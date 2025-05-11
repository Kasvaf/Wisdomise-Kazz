import { useCallback } from 'react';
import {
  createSearchParams,
  useLocation,
  useNavigate,
  useSearchParams,
} from 'react-router-dom';
import { type AVAILABLE_LISTS } from 'modules/discovery/lib';

export const useNavigateToMenuItem = () => {
  const { pathname } = useLocation();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  return useCallback(
    (list: (typeof AVAILABLE_LISTS)[number]) => {
      const newSearchParams = createSearchParams(
        pathname.startsWith('/discovery') ? searchParams : undefined,
      );
      navigate({
        pathname: `/discovery/${list}`,
        search: newSearchParams.toString(),
      });
    },
    [navigate, pathname, searchParams],
  );
};
