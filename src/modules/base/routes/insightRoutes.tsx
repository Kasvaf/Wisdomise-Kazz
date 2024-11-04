import * as React from 'react';
import { Navigate, type Params, type RouteObject } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import PageInsight from 'modules/insight/PageInsight';
import { shortenAddress } from 'utils/shortenAddress';
import PageCoinDetailRedirect from 'modules/insight/coinRadar/PageCoinDetailRedirect';
import Container from '../Container';

const PageCoinRadar = React.lazy(
  () => import('modules/insight/coinRadar/PageCoinRadar'),
);
const PageCoinRadarDetail = React.lazy(
  () => import('modules/insight/coinRadar/PageCoinRadarDetail'),
);

const PageSocialRadarRedirect = React.lazy(
  () => import('modules/insight/coinRadar/PageSocialRadarRedirect'),
);

const PageMarketPulse = React.lazy(
  () => import('modules/insight/PageMarketPulse'),
);

const PageWhales = React.lazy(() => import('modules/insight/whale/PageWhales'));

const PageWhaleDetail = React.lazy(
  () => import('modules/insight/whale/PageWhaleDetail'),
);

const PageAlerts = React.lazy(() => import('modules/account/PageAlerts'));

const useInsightRoutes = () => {
  const { t } = useTranslation('base');
  return [
    {
      element: <Container />,
      path: 'insight',
      handle: { crumb: t('menu.coin-radar.title') },
      children: [
        { path: '', element: <Navigate to="/insight/overview" replace /> },
        { path: 'overview', element: <PageInsight /> },
        {
          path: 'coin-radar',
          handle: { crumb: t('menu.hot-coins.title') },
          element: <PageCoinRadar />,
        },
        {
          path: 'coin-radar/:slug',
          element: <PageCoinDetailRedirect />,
        },
        {
          path: 'social-radar/*',
          element: <PageSocialRadarRedirect />,
        },
        {
          path: 'market-pulse',
          element: <PageMarketPulse />,
          handle: { crumb: t('menu.ai-indicators.title') },
        },
        {
          path: 'whales',
          handle: { crumb: t('menu.whales.title') },
          children: [
            {
              path: '',
              element: <PageWhales />,
            },
            {
              path: ':network/:address',
              element: <PageWhaleDetail />,
              handle: {
                crumb: (p: Params<string>) =>
                  `${p.network ?? ''}-${shortenAddress(p.address || '')}`,
              },
            },
          ],
        },
        {
          path: 'alerts',
          handle: { crumb: t('menu.alerts.title') },
          element: <PageAlerts />,
        },
      ],
    },
    {
      path: 'coin',
      element: <Container />,
      handle: { crumb: t('menu.coin.title') },
      children: [
        {
          path: '',
          element: (
            <Navigate
              replace
              to={{
                pathname: '/insight/coin-radar',
              }}
            />
          ),
        },
        {
          path: ':slug',
          element: <PageCoinRadarDetail />,
          handle: { crumb: (p: Params<string>) => p.slug },
        },
      ],
    },
  ] satisfies RouteObject[];
};

export default useInsightRoutes;
