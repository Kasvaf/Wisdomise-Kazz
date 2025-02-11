import { type RouteObject } from 'react-router-dom';
import useAutoTraderRoutes from 'modules/base/routes/autotraderRoutes';
import useEmbeddedRoutes from 'modules/base/routes/embeddedRoutes';
import Container from '../Container';
import PageMenu from '../Container/SideMenu/PageMenu';
import PageRedirect from '../PageRedirect';
import Boundary from './Boundary';
import useInsightRoutes from './insightRoutes';
import useAccountRoutes from './accountRoutes';

const useRoutes = () => {
  return [
    {
      element: <Boundary />,
      children: [
        ...useAccountRoutes(),
        ...useInsightRoutes(),
        ...useEmbeddedRoutes(),
        ...useAutoTraderRoutes(),
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
