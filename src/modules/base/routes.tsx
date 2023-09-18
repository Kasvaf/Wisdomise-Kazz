/* eslint-disable import/max-dependencies */
import * as React from 'react';
import { Navigate, type RouteObject } from 'react-router-dom';
import PageRef from 'modules/account/PageRef';
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
const PageProfile = React.lazy(() => import('modules/account/PageProfile'));
const PageReferral = React.lazy(() => import('modules/account/PageReferral'));
const PageKYC = React.lazy(() => import('modules/account/kyc/PageKYC'));
const PageSumSub = React.lazy(() => import('modules/account/kyc/PageSumSub'));

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
            path: 'profile',
            element: suspended(<PageProfile />),
          },
          {
            path: 'referral',
            element: suspended(<PageReferral />),
          },
          { path: 'ref/:referrerCode', element: <PageRef /> },
          {
            path: 'kyc',
            element: suspended(<PageKYC />),
          },
          {
            path: 'kyc/sumsub',
            element: suspended(<PageSumSub />),
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
