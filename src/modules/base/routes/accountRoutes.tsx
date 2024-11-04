import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { Navigate, type RouteObject } from 'react-router-dom';
import PageAccount from 'modules/account/PageAccount';
import Container from '../Container';

const PageRef = React.lazy(() => import('modules/account/PageRef'));
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

const ChangeStripeCardInfoPage = React.lazy(
  () =>
    import('modules/account/PageBilling/paymentMethods/Fiat/ChangeCardInfo'),
);

const Web3Wrapper = React.lazy(() => import('modules/account/Web3Provider'));

const useAccountRoutes = () => {
  const { t } = useTranslation('base');

  return [
    { path: 'ref/:referrerCode', element: <PageRef /> },
    {
      element: <Container />,
      path: 'account',
      handle: { crumb: t('menu.account.title') },
      children: [
        { path: '', element: <Navigate to="/account/overview" replace /> },
        { path: 'overview', element: <PageAccount /> },
        {
          path: 'profile',
          element: <PageProfile />,
          handle: { crumb: t('menu.profile.title') },
        },
        {
          path: 'exchange-accounts',
          element: <PageExchangeAccount />,
          handle: { crumb: t('menu.account-manager.title') },
        },
        {
          path: 'referral',
          element: <PageReferral />,
          handle: { crumb: t('menu.referral.title') },
        },
        {
          path: 'notification-center',
          element: <PageNotification />,
          handle: { crumb: t('menu.notification-center.title') },
        },
        {
          path: '',
          element: <Web3Wrapper />,
          children: [
            {
              path: 'billing',
              handle: { crumb: t('menu.billing.title') },
              children: [
                {
                  path: '',
                  element: <PageBilling />,
                },
                {
                  path: 'change-stripe-card-info',
                  element: <ChangeStripeCardInfoPage />,
                  handle: { crumb: 'Stripe' },
                },
              ],
            },
            {
              path: 'token',
              element: <PageToken />,
              handle: { crumb: t('menu.token.title') },
            },
          ],
        },
      ],
    },
  ] satisfies RouteObject[];
};

export default useAccountRoutes;
