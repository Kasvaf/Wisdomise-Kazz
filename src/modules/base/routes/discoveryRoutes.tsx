import PageDiscovery from 'modules/discovery/PageDiscovery';
import { Navigate, type RouteObject } from 'react-router-dom';
import Container from '../Container';

const useDiscoveryRoutes = () => {
  return [
    {
      path: '',
      element: <Container />,
      children: [
        {
          path: 'discovery',
          index: true,
          element: <Navigate to="/trench" />,
        },
        {
          path: ':list',
          element: <PageDiscovery />,
        },
        {
          path: ':detail/:slug1/:slug2?/:slug3?',
          element: <PageDiscovery />,
        },
      ],
    },
  ] satisfies RouteObject[];
};

export default useDiscoveryRoutes;
