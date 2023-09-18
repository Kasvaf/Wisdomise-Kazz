import * as React from 'react';
import { Navigate, type RouteObject } from 'react-router-dom';
import Container from './Container';
import PageWrapper from './PageWrapper';

const PageSignalsMatrix = React.lazy(
  () => import('modules/products/PageSignalsMatrix'),
);

const PageProductsCatalog = React.lazy(
  () => import('modules/products/PageProductsCatalog'),
);
const PageProductCatalogDetail = React.lazy(
  () => import('modules/products/PageProductCatalogDetail'),
);

const PageAssetOverview = React.lazy(
  () => import('modules/wallet/PageAssetOverview'),
);

const PageFPIPositions = React.lazy(
  () => import('modules/wallet/PageFPIPositions'),
);
const PageKYC = React.lazy(() => import('modules/account/PageKYC'));

const suspended = (el: React.ReactNode) => (
  <React.Suspense fallback={<PageWrapper loading />}>{el}</React.Suspense>
);

const routes: RouteObject[] = [
  {
    element: <Container />,
    children: [
      {
        path: 'app',
        children: [
          {
            path: 'assets',
            element: suspended(<PageAssetOverview />),
          },
          {
            path: 'fpi/:fpiKey',
            element: suspended(<PageFPIPositions />),
          },
          {
            path: 'products-catalog',
            element: suspended(<PageProductsCatalog />),
          },
          {
            path: 'products-catalog/:fpKey',
            element: suspended(<PageProductCatalogDetail />),
          },
          {
            path: 'signals',
            element: suspended(<PageSignalsMatrix />),
          },
        ],
      },

      {
        path: 'account',
        children: [
          {
            path: 'kyc',
            element: suspended(<PageKYC />),
          },
        ],
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/app/assets" />,
  },
];

export default routes;
