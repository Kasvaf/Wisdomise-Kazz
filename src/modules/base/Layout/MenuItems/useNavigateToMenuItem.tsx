import { useCallback } from 'react';
import {
  createSearchParams,
  useLocation,
  useNavigate,
  useSearchParams,
} from 'react-router-dom';
import { type MENU_ITEMS } from './useMenuItems';

export const useNavigateToMenuItem = () => {
  const { pathname } = useLocation();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  return useCallback(
    (list: (typeof MENU_ITEMS)[number]) => {
      const newSearchParams = createSearchParams(
        pathname === '/discovery' ? searchParams : undefined,
      );
      newSearchParams.set('list', list);
      navigate({
        pathname: '/discovery',
        search: newSearchParams.toString(),
      });
    },
    [navigate, pathname, searchParams],
  );
};
