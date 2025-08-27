import useAutoTraderRoutes from 'modules/base/routes/autotraderRoutes';
import useEmbeddedRoutes from 'modules/base/routes/embeddedRoutes';
import type { RouteObject } from 'react-router-dom';
import useAccountRoutes from './accountRoutes';
import Boundary from './Boundary';
import useDiscoveryRoutes from './discoveryRoutes';

const useRoutes = () => {
  return [
    {
      element: <Boundary />,
      children: [
        ...useAccountRoutes(),
        ...useEmbeddedRoutes(),
        ...useAutoTraderRoutes(),
        ...useDiscoveryRoutes(),
      ],
    },
  ] satisfies RouteObject[];
};

export default useRoutes;
