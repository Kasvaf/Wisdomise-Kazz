import { Navigate, type RouteObject } from 'react-router-dom';
import useMiniAppRoutes from 'modules/base/routes/miniAppRoutes';
import { isMiniApp } from 'utils/version';
import Container from '../Container';
import PageMenu from '../Container/SideMenu/PageMenu';
import Boundary from './Boundary';
import useInsightRoutes from './insightRoutes';
import useAccountRoutes from './accountRoutes';

const useRoutes = () => {
  const webRoutes = [...useInsightRoutes(), ...useAccountRoutes()];
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
        { path: '*', element: <Navigate to="/insight/overview" /> },
      ],
    },
  ] satisfies RouteObject[];
};

export default useRoutes;
