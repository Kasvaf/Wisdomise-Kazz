import * as React from 'react';
import { Navigate, type Params, type RouteObject } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import PageInsight from 'modules/insight/PageInsight';
import { shortenAddress } from 'utils/shortenAddress';
import Container from '../Container';

const PageMarketplace = React.lazy(
  () => import('modules/insight/PageMarketplace'),
);

const PageAthena = React.lazy(() => import('modules/athena/PageAthena'));
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

const useInsightRoutes = () => {
  const { t } = useTranslation('base');
  return [
    {
      element: <Container />,
      path: 'insight',
      handle: { crumb: t('menu.insight.title') },
      children: [
        { path: '', element: <Navigate to="/insight/overview" replace /> },
        { path: 'overview', element: <PageInsight /> },
        {
          path: 'marketplace',
          element: <PageMarketplace />,
          handle: { crumb: t('menu.marketplace.title') },
        },
        {
          path: 'athena',
          element: <PageAthena />,
          handle: { crumb: t('menu.athena.title') },
        },
        {
          path: 'coin-radar',
          handle: { crumb: t('menu.coin-radar.title') },
          children: [
            { index: true, element: <PageCoinRadar /> },
            {
              path: ':symbol',
              element: <PageCoinRadarDetail />,
              handle: { crumb: (p: Params<string>) => p.symbol },
            },
          ],
        },
        {
          path: 'social-radar/*',
          element: <PageSocialRadarRedirect />,
        },
        {
          path: 'market-pulse',
          element: <PageMarketPulse />,
          handle: { crumb: t('menu.market-pulse.title') },
        },
        {
          path: 'whales',
          handle: { crumb: t('menu.whales.title') },
          children: [
            { index: true, element: <PageWhales /> },
            {
              path: ':network/:address',
              element: <PageWhaleDetail />,
              handle: {
                crumb: (p: Params<string>) => shortenAddress(p.address || ''),
              },
            },
          ],
        },
      ],
    },
  ] satisfies RouteObject[];
};

export default useInsightRoutes;
