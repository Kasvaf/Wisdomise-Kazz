import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { Navigate, type RouteObject } from 'react-router-dom';
import { ActiveNetworkProvider } from 'modules/base/active-network';
import Container from '../Container';
import { type RouteHandle } from './types';

const PageAccount = React.lazy(() => import('modules/account/PageAccount'));
const PageRef = React.lazy(() => import('modules/account/PageRef'));
const PageProfile = React.lazy(() => import('modules/account/PageProfile'));
const PageReferral = React.lazy(() => import('modules/account/PageReferral'));
const PageExchangeAccount = React.lazy(
  () => import('modules/account/PageExchangeAccount'),
);
const PageBilling = React.lazy(() => import('modules/account/PageBilling'));
const PageToken = React.lazy(() => import('modules/account/PageToken'));
const PageRewards = React.lazy(() => import('modules/account/PageRewards'));
const ChangeStripeCardInfoPage = React.lazy(
  () =>
    import('modules/account/PageBilling/paymentMethods/Fiat/ChangeCardInfo'),
);
const PageAlerts = React.lazy(() => import('modules/alert/PageAlerts'));

const useAccountRoutes = () => {
  const { t } = useTranslation('base');

  return [
    { path: 'ref/:referrerCode', element: <PageRef /> },
    {
      element: <Container />,
      path: 'account',
      handle: {
        crumb: {
          text: t('menu.account.title'),
          href: '/account/overview',
        },
      } satisfies RouteHandle,
      children: [
        { path: '', element: <Navigate to="/account/overview" replace /> },
        {
          path: 'overview',
          element: <PageAccount />,
          handle: {
            crumb: { text: 'Overview', href: '/account/overview' },
          } satisfies RouteHandle,
        },
        {
          path: 'profile',
          element: <PageProfile />,
          handle: {
            crumb: {
              text: t('menu.profile.title'),
              href: '/account/profile',
            },
          } satisfies RouteHandle,
        },
        {
          path: 'exchange-accounts',
          element: <PageExchangeAccount />,
          handle: {
            crumb: {
              text: t('menu.account-manager.title'),
              href: '/account/exchange-accounts',
            },
          } satisfies RouteHandle,
        },
        {
          path: 'referral',
          element: <PageReferral />,
          handle: {
            crumb: {
              text: t('menu.referral.title'),
              href: '/account/referral',
            },
          } satisfies RouteHandle,
        },

        {
          path: 'billing',
          handle: {
            crumb: {
              text: t('menu.billing.title'),
              href: '/account/billing',
            },
          } satisfies RouteHandle,
          children: [
            {
              path: '',
              element: (
                <ActiveNetworkProvider network="polygon" setOnLayout>
                  <PageBilling />
                </ActiveNetworkProvider>
              ),
            },
            {
              path: 'change-stripe-card-info',
              element: <ChangeStripeCardInfoPage />,
              handle: {
                crumb: {
                  text: 'Stripe',
                  href: '/account/change-stripe-card-info',
                },
              } satisfies RouteHandle,
            },
          ],
        },
        {
          path: 'token',
          element: (
            <ActiveNetworkProvider network="polygon" setOnLayout>
              <PageToken />
            </ActiveNetworkProvider>
          ),
          handle: {
            crumb: {
              text: t('menu.token.title'),
              href: '/account/token',
            },
          } satisfies RouteHandle,
        },
        {
          path: 'rewards',
          element: (
            <ActiveNetworkProvider network="solana" setOnLayout>
              <PageRewards />
            </ActiveNetworkProvider>
          ),
          handle: {
            crumb: {
              text: t('menu.rewards.title'),
              href: '/account/rewards',
            },
          } satisfies RouteHandle,
        },
        {
          path: 'alerts',
          handle: {
            crumb: {
              text: t('menu.alerts.title'),
              href: '/account/alerts',
            },
          } satisfies RouteHandle,
          element: <PageAlerts />,
        },
      ],
    },
  ] satisfies RouteObject[];
};

export default useAccountRoutes;
