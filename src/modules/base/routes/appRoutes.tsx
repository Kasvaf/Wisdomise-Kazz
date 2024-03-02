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
  () => import('modules/signaler/PageSignalsMatrix'),
);
const PageCoins = React.lazy(() => import('modules/signaler/PageCoins'));
const PageSignaler = React.lazy(() => import('modules/signaler/PageSignaler'));

const PageProductsCatalog = React.lazy(
  () => import('modules/products/PageProductsCatalog'),
);
const PageProductCatalogDetail = React.lazy(
  () => import('modules/products/PageProductCatalogDetail'),
);

const PageFPIPositions = React.lazy(
  () => import('modules/products/PageFPIPositions'),
);

const PageProtocolDetails = React.lazy(
  () => import('modules/products/PageProtocolDetails'),
);
const PageAthena = React.lazy(() => import('modules/athena/PageAthena'));
const PageSocialRadar = React.lazy(
  () => import('modules/insight/PageSocialRadar'),
);
const PageSocialRadarDetail = React.lazy(
  () => import('modules/insight/PageSocialRadarDetail'),
);

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
      { path: 'coins', element: <PageCoins /> },
      { path: 'coins/signaler', element: <PageSignaler /> },
      { path: 'athena', element: <PageAthena /> },
      { path: 'social-radar', element: <PageSocialRadar /> },
      { path: 'social-radar/:symbol', element: <PageSocialRadarDetail /> },
    ],
  },
  {
    element: <Container />,
    path: 'app',
    children: [
      {
        path: 'staking/protocol/:id',
        element: <PageProtocolDetails />,
      },
      { path: '', element: <Navigate to="/investment" /> },
    ],
  },
];

export default appRoutes;
