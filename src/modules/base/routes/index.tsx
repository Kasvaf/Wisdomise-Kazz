import { type RouteObject } from 'react-router-dom';
import useMiniAppRoutes from 'modules/base/routes/miniAppRoutes';
import { isMiniApp } from 'utils/version';
import Container from '../Container';
import PageMenu from '../Container/SideMenu/PageMenu';
import PageRedirect from '../PageRedirect';
import Boundary from './Boundary';
import useMarketplaceRoutes from './marketplaceRoutes';
import useInsightRoutes from './insightRoutes';
import useAccountRoutes from './accountRoutes';
import useUsersRoutes from './usersRoutes';
import useDashboardRoutes from './dashboardRoutes';

const useRoutes = () => {
  const webRoutes = [
    ...useDashboardRoutes(),
    ...useMarketplaceRoutes(),
    ...useInsightRoutes(),
    ...useAccountRoutes(),
    ...useUsersRoutes(),
  ];
  const miniAppRoutes = useMiniAppRoutes();

  const activeRoutes = isMiniApp ? miniAppRoutes : webRoutes;

  return [
    {
      element: <Boundary />,
      children: [
        ...activeRoutes,
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
        { path: '*', element: <PageRedirect /> },
      ],
    },
  ] satisfies RouteObject[];
};

export default useRoutes;
