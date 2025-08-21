import useAutoTraderRoutes from 'modules/base/routes/autotraderRoutes';
import useEmbeddedRoutes from 'modules/base/routes/embeddedRoutes';
import type { RouteObject } from 'react-router-dom';
import PageRedirect from '../PageRedirect';
import useAccountRoutes from './accountRoutes';
import Boundary from './Boundary';
import useDiscoveryRoutes from './discoveryRoutes';

const useRoutes = () => {
  return [
    {
      element: <Boundary />,
      children: [
        ...useAccountRoutes(),
        ...useDiscoveryRoutes(),
        ...useEmbeddedRoutes(),
        ...useAutoTraderRoutes(),
        {
          path: '*',
          element: <PageRedirect />,
        },
      ],
    },
  ] satisfies RouteObject[];
};

export default useRoutes;
