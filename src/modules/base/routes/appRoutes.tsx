/* eslint-disable import/max-dependencies */
import * as React from 'react';
import { Navigate, type RouteObject } from 'react-router-dom';

import PageInvestment from 'modules/products/PageInvestment';
import PageInsight from 'modules/products/PageInsight';
import Container from '../Container';

const PageAssetOverview = React.lazy(
  () => import('modules/wallet/PageAssetOverview'),
);

const PageSignalsMatrix = React.lazy(
  () => import('modules/strategy/PageSignalsMatrix'),
);

const PageProductsCatalog = React.lazy(
  () => import('modules/products/PageProductsCatalog'),
);
const PageProductCatalogDetail = React.lazy(
  () => import('modules/products/PageProductCatalogDetail'),
);

const PageFPIPositions = React.lazy(
  () => import('modules/products/PageFPIPositions'),
);

const PageStrategiesList = React.lazy(
  () => import('modules/strategy/PageStrategiesList'),
);
const PageStrategyCreate = React.lazy(
  () => import('modules/strategy/PageStrategyCreate'),
);
const PageStrategyDetails = React.lazy(
  () => import('modules/strategy/PageStrategyDetails'),
);
const PageProtocolDetails = React.lazy(
  () => import('modules/staking/PageProtocolDetails'),
);
const PageAthena = React.lazy(() => import('modules/athena/PageAthena'));

const appRoutes: RouteObject[] = [
  {
    element: <Container />,
    path: 'investment',
    children: [
      { path: '', element: <PageInvestment /> },
      { path: 'assets', element: <PageAssetOverview /> },
      { path: 'fpi/:fpiKey', element: <PageFPIPositions /> },
      {
        path: 'products-catalog',
        element: <PageProductsCatalog />,
      },
      {
        path: 'products-catalog/:fpKey',
        element: <PageProductCatalogDetail />,
      },
    ],
  },
  {
    element: <Container />,
    path: 'insight',
    children: [
      { path: '', element: <PageInsight /> },
      { path: 'signals', element: <PageSignalsMatrix /> },
      { path: 'athena', element: <PageAthena /> },
    ],
  },
  {
    element: <Container />,
    path: 'app',
    children: [
      { path: 'strategy', element: <PageStrategiesList /> },
      { path: 'strategy/new', element: <PageStrategyCreate /> },
      { path: 'strategy/:id', element: <PageStrategyDetails /> },
      {
        path: 'staking/protocol/:id',
        element: <PageProtocolDetails />,
      },
      { path: '', element: <Navigate to="/investment" /> },
    ],
  },
];

export default appRoutes;
