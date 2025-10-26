import PageDiscovery from 'modules/discovery/PageDiscovery';
import { lazy } from 'react';
import { Navigate, type RouteObject } from 'react-router-dom';
import Container from '../Container';

const PageMeta = lazy(() => import('modules/discovery/PageMeta'));

const useDiscoveryRoutes = () => {
  return [
    {
      path: '',
      element: <Container />,
      children: [
        {
          path: '',
          index: true,
          element: <Navigate to="/trench" />,
        },
        {
          path: 'meta',
          element: <PageMeta />,
        },
        {
          path: ':list',
          element: <PageDiscovery />,
        },
        {
          path: ':detail/:slug1/:slug2?/:slug3?',
          element: <PageDiscovery />,
        },
        {
          path: '*',
          element: <Navigate to="/trench" />,
        },
      ],
    },
  ] satisfies RouteObject[];
};

export default useDiscoveryRoutes;
