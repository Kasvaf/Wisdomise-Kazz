import { type RouteObject } from 'react-router-dom';
import PageDiscovery from 'modules/discovery/PageDiscovery';
import Container from '../Container';

const useDiscoveryRoutes = () => {
  return [
    {
      element: <Container />,
      path: 'discovery',
      children: [
        {
          path: '',
          element: <PageDiscovery />,
        },
      ],
    },
  ] satisfies RouteObject[];
};

export default useDiscoveryRoutes;
