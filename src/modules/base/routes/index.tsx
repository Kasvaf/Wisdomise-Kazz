import { Navigate, type RouteObject } from 'react-router-dom';
import Container from '../Container';
import PageMenu from '../Container/SideMenu/PageMenu';
import Boundary from './Boundary';
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
              element: <PageMenu />,
            },
          ],
        },
        { path: '*', element: <Navigate to="/insight/overview" /> },
      ],
    },
  ] satisfies RouteObject[];
};

export default useRoutes;
