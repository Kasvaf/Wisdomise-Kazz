import * as React from 'react';
import { type Params, type RouteObject } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { shortenAddress } from 'utils/shortenAddress';
import Container from '../Container';
import PageRedirect from '../PageRedirect';

const PageInsight = React.lazy(() => import('modules/insight/PageInsight'));

const PageOnboarding = React.lazy(
  () => import('modules/insight/PageOnboarding'),
);

const PageCoinRadar = React.lazy(
  () => import('modules/insight/coinRadar/PageCoinRadar'),
);

const PageCoinRadarDetail = React.lazy(
  () => import('modules/insight/coinRadar/PageCoinRadarDetail'),
);

const PageMarketPulse = React.lazy(
  () => import('modules/insight/PageMarketPulse'),
);

const PageWhales = React.lazy(() => import('modules/insight/whale/PageWhales'));

const PageWhaleDetail = React.lazy(
  () => import('modules/insight/whale/PageWhaleDetail'),
);

const PageAlerts = React.lazy(() => import('modules/alert/PageAlerts'));

const useInsightRoutes = () => {
  const { t } = useTranslation('base');
  return [
    {
      path: 'coin-radar/onboarding',
      handle: { crumb: t('menu.ai-indicators.title') },
      element: <PageOnboarding />,
    },
    {
      element: <Container />,
      path: 'coin-radar',
      handle: { crumb: t('menu.coin-radar.title') },
      children: [
        { path: '', element: <PageRedirect /> },
        {
          path: 'overview',
          handle: { crumb: t('menu.overview.title') },
          element: <PageInsight />,
        },
        {
          path: 'social-radar',
          handle: { crumb: t('menu.hot-coins.title') },
          element: <PageCoinRadar />,
        },
        {
          path: 'technical-radar',
          element: <PageMarketPulse />,
          handle: { crumb: t('menu.ai-indicators.title') },
        },
        {
          path: 'whale-radar',
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
                  `${p.network ?? ''}-${shortenAddress(p.address)}`,
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
          path: ':slug',
          element: <PageCoinRadarDetail />,
          handle: { crumb: (p: Params<string>) => p.slug },
        },
      ],
    },
  ] satisfies RouteObject[];
};

export default useInsightRoutes;
