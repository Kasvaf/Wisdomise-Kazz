import * as React from 'react';
import { Navigate, type RouteObject } from 'react-router-dom';
import PageRef from 'modules/account/PageRef';
import PageAccount from 'modules/account/PageAccount';
import Container from '../Container';

const PageProfile = React.lazy(() => import('modules/account/PageProfile'));
const PageReferral = React.lazy(() => import('modules/account/PageReferral'));
const PageExchangeAccount = React.lazy(
  () => import('modules/account/PageExchangeAccount'),
);
const PageBilling = React.lazy(() => import('modules/account/PageBilling'));
const PageToken = React.lazy(() => import('modules/account/PageToken'));
const PageNotification = React.lazy(
  () => import('modules/account/PageNotification'),
);
const PageKYC = React.lazy(() => import('modules/account/kyc/PageKYC'));
const PageSumSub = React.lazy(() => import('modules/account/kyc/PageSumSub'));

const ChangeStripeCardInfoPage = React.lazy(
  () =>
    import('modules/account/PageBilling/paymentMethods/Fiat/ChangeCardInfo'),
);

const Web3Wrapper = React.lazy(() => import('modules/account/Web3Provider'));

const accountRoutes: RouteObject[] = [
  { path: 'ref/:referrerCode', element: <PageRef /> },
  {
    element: <Container />,
    path: 'account',
    children: [
      { path: '', element: <PageAccount /> },
      { path: 'profile', element: <PageProfile /> },
      { path: 'exchange-accounts', element: <PageExchangeAccount /> },
      { path: 'referral', element: <PageReferral /> },
      { path: 'notification-center', element: <PageNotification /> },
      {
        path: 'billing/change-stripe-card-info',
        element: <ChangeStripeCardInfoPage />,
      },
      { path: 'kyc', element: <PageKYC /> },
      { path: 'kyc/sumsub', element: <PageSumSub /> },
      { path: '', element: <Navigate to="/account/billing" /> },
      {
        path: '',
        element: <Web3Wrapper />,
        children: [
          { path: 'billing', element: <PageBilling /> },
          { path: 'token', element: <PageToken /> },
        ],
      },
    ],
  },
];

export default accountRoutes;
