/* eslint-disable import/max-dependencies */
import * as React from 'react';
import { Navigate, type RouteObject } from 'react-router-dom';
import PageRef from 'modules/account/PageRef';

import ChangePaymentMethodPage from 'modules/account/PageBilling/ChangePaymentMethodPage';
import Container from './Container';
import PageWrapper from './PageWrapper';

const PageConfirmSignUp = React.lazy(
  () => import('modules/auth/PageConfirmSignUp'),
);
const PageSecondaryForm = React.lazy(
  () => import('modules/auth/PageSecondaryForm'),
);
const PageAuthCallback = React.lazy(
  () => import('modules/auth/PageAuthCallback'),
);
const PageLogin = React.lazy(() => import('modules/auth/PageLogin'));
const PageLogout = React.lazy(() => import('modules/auth/PageLogout'));

// ================================================================================

const PageProfile = React.lazy(() => import('modules/account/PageProfile'));
const PageReferral = React.lazy(() => import('modules/account/PageReferral'));
const PageExchangeAccount = React.lazy(
  () => import('modules/account/PageExchangeAccount'),
);
const PageBilling = React.lazy(() => import('modules/account/PageBilling'));
const PageNotification = React.lazy(
  () => import('modules/account/PageNotification'),
);
const PageKYC = React.lazy(() => import('modules/account/kyc/PageKYC'));
const PageSumSub = React.lazy(() => import('modules/account/kyc/PageSumSub'));

const suspended = (el: React.ReactNode) => (
  <React.Suspense fallback={<PageWrapper loading />}>{el}</React.Suspense>
);

// ================================================================================

const PageAssetOverview = React.lazy(
  () => import('modules/wallet/PageAssetOverview'),
);

const PageSignalsMatrix = React.lazy(
  () => import('modules/products/PageSignalsMatrix'),
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

const routes: RouteObject[] = [
  { path: 'auth/callback', element: suspended(<PageAuthCallback />) },
  { path: 'auth/login', element: suspended(<PageLogin />) },
  { path: 'auth/logout', element: suspended(<PageLogout />) },
  { path: 'auth/verify-email', element: suspended(<PageConfirmSignUp />) },
  { path: 'auth/secondary-signup', element: suspended(<PageSecondaryForm />) },
  { path: 'ref/:referrerCode', element: <PageRef /> },
  // ================================================================================
  {
    element: <Container />,
    children: [
      { path: 'account/profile', element: suspended(<PageProfile />) },
      {
        path: 'account/exchange-accounts',
        element: suspended(<PageExchangeAccount />),
      },
      { path: 'account/referral', element: suspended(<PageReferral />) },
      {
        path: 'account/notification-center',
        element: suspended(<PageNotification />),
      },
      {
        path: 'account/billing',
        element: suspended(<PageBilling />),
      },
      {
        path: 'account/billing/change-payment-method',
        element: <ChangePaymentMethodPage />,
      },
      {
        path: 'account/kyc',
        element: suspended(<PageKYC />),
      },
      {
        path: 'account/kyc/sumsub',
        element: suspended(<PageSumSub />),
      },
      // ================================================================================

      { path: 'app/assets', element: suspended(<PageAssetOverview />) },
      { path: 'app/fpi/:fpiKey', element: suspended(<PageFPIPositions />) },
      {
        path: 'app/products-catalog',
        element: suspended(<PageProductsCatalog />),
      },
      {
        path: 'app/products-catalog/:fpKey',
        element: suspended(<PageProductCatalogDetail />),
      },
      { path: 'app/signals', element: suspended(<PageSignalsMatrix />) },
      { path: 'app/strategy', element: suspended(<PageStrategiesList />) },
      { path: 'app/strategy/new', element: suspended(<PageStrategyCreate />) },
      { path: 'app/strategy/:id', element: suspended(<PageStrategyDetails />) },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/app/assets" />,
  },
];

export default routes;
