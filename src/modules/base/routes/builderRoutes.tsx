/* eslint-disable import/max-dependencies */
import * as React from 'react';
import { type RouteObject } from 'react-router-dom';

import Container from '../Container';

const PageStrategyCreate = React.lazy(
  () => import('modules/strategy/PageStrategyCreate'),
);
const PageStrategyDetails = React.lazy(
  () => import('modules/strategy/PageStrategyDetails'),
);

const PageBuilder = React.lazy(() => import('modules/builder/PageBuilder'));
const PageSignalersList = React.lazy(
  () => import('modules/builder/PageSignalersList'),
);
const PageSignalerCreate = React.lazy(
  () => import('modules/builder/PageSignalerCreate'),
);
const PageSignalerDetails = React.lazy(
  () => import('modules/builder/PageSignalerDetails'),
);

const builderRoutes: RouteObject[] = [
  {
    element: <Container />,
    path: 'builder',
    children: [
      { path: '', element: <PageBuilder /> },
      { path: 'signalers', element: <PageSignalersList /> },
      { path: 'signalers/new', element: <PageSignalerCreate /> },
      { path: 'signalers/:id', element: <PageSignalerDetails /> },
      { path: 'fp', element: <PageStrategyCreate /> },
      { path: 'fp/new', element: <PageStrategyCreate /> },
      { path: 'fp/:id', element: <PageStrategyDetails /> },
    ],
  },
];

export default builderRoutes;
