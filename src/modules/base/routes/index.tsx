import { type RouteObject } from 'react-router-dom';
import useAutoTraderRoutes from 'modules/base/routes/autotraderRoutes';
import useEmbeddedRoutes from 'modules/base/routes/embeddedRoutes';
import Boundary from './Boundary';
import useDiscoveryRoutes from './discoveryRoutes';
import useAccountRoutes from './accountRoutes';

const useRoutes = () => {
  return [
    {
      element: <Boundary />,
      children: [
        ...useAccountRoutes(),
        ...useDiscoveryRoutes(),
        ...useEmbeddedRoutes(),
        ...useAutoTraderRoutes(),
      ],
    },
  ] satisfies RouteObject[];
};

export default useRoutes;
