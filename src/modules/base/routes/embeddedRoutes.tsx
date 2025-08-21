import * as React from 'react';
import type { RouteObject } from 'react-router-dom';

const PageSocialRadar = React.lazy(
  () => import('modules/embedded/PageSocialRadar'),
);

const PageFeatures = React.lazy(() => import('modules/embedded/PageFeatures'));

const useEmbeddedRoutes = () => {
  return [
    {
      path: 'embedded',
      children: [
        { path: 'social-radar', element: <PageSocialRadar /> },
        { path: 'features', element: <PageFeatures /> },
      ],
    },
  ] satisfies RouteObject[];
};

export default useEmbeddedRoutes;
