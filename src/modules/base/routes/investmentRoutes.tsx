/* eslint-disable import/max-dependencies */
import * as React from 'react';
import { type RouteObject } from 'react-router-dom';
import PageInvestment from 'modules/investment/PageInvestment';
import Container from '../Container';

const PageAssetOverview = React.lazy(
  () => import('modules/investment/PageAssetOverview'),
);

const PageProductsCatalog = React.lazy(
  () => import('modules/investment/PageProductsCatalog'),
);
const PageProductCatalogDetail = React.lazy(
  () => import('modules/investment/PageProductCatalogDetail'),
);

const PageFPIPositions = React.lazy(
  () => import('modules/investment/PageFPIPositions'),
);

const PageProtocolDetails = React.lazy(
  () => import('modules/investment/PageProtocolDetails'),
);

const investmentRoutes: RouteObject[] = [
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
        path: 'products-catalog/fp/:fpKey',
        element: <PageProductCatalogDetail />,
      },
      {
        path: 'products-catalog/stake/:id',
        element: <PageProtocolDetails />,
      },
    ],
  },
];

export default investmentRoutes;
