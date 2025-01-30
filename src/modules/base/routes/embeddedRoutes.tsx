import { type RouteObject } from 'react-router-dom';
import * as React from 'react';

const PageSocialRadar = React.lazy(
  () => import('modules/embedded/PageSocialRadar'),
);

const PagePricing = React.lazy(() => import('modules/embedded/PagePricing'));

const useEmbeddedRoutes = () => {
  return [
    {
      path: 'embedded',
      children: [
        { path: 'social-radar', element: <PageSocialRadar /> },
        { path: 'pricing', element: <PagePricing /> },
      ],
    },
  ] satisfies RouteObject[];
};

export default useEmbeddedRoutes;
