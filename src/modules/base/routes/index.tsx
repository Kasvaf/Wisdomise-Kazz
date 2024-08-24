import { Navigate, type RouteObject } from 'react-router-dom';
import Container from '../Container';
import MenuItemsContent from '../Container/SideMenu/MenuItemsContent';
import Boundary from './Boundary';
import useAuthRoutes from './authRoutes';
import useMarketplaceRoutes from './marketplaceRoutes';
import useInsightRoutes from './insightRoutes';
import useAccountRoutes from './accountRoutes';
import useUsersRoutes from './usersRoutes';
import useDashboardRoutes from './dashboardRoutes';

const useRoutes = () => {
  return [
    {
      element: <Boundary />,
      children: [
        ...useAuthRoutes(),
        ...useDashboardRoutes(),
        ...useMarketplaceRoutes(),
        ...useInsightRoutes(),
        ...useAccountRoutes(),
        ...useUsersRoutes(),
        {
          element: <Container />,
          path: '/menu',
          children: [
            {
              path: '',
              element: <MenuItemsContent collapsed={false} />,
            },
          ],
        },
        { path: '*', element: <Navigate to="/insight/overview" /> },
      ],
    },
  ] satisfies RouteObject[];
};

export default useRoutes;
