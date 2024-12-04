import { type RouteObject } from 'react-router-dom';
import * as React from 'react';

const PageSocialRadar = React.lazy(
  () => import('modules/embedded/PageSocialRadar'),
);

const useEmbeddedRoutes = () => {
  return [
    {
      path: 'embedded',
      children: [{ path: 'social-radar', element: <PageSocialRadar /> }],
    },
  ] satisfies RouteObject[];
};

export default useEmbeddedRoutes;
