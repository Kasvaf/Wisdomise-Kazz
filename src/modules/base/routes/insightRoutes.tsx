import * as React from 'react';
import { type Params, type RouteObject } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { shortenAddress } from 'utils/shortenAddress';
import Container from '../Container';
import PageRedirect from '../PageRedirect';

const PageCoinRadar = React.lazy(() => import('modules/insight/PageCoinRadar'));

const PageOnboarding = React.lazy(
  () => import('modules/insight/PageOnboarding'),
);

const PageSocialRadar = React.lazy(
  () => import('modules/insight/PageSocialRadar'),
);

const PageCoinDetails = React.lazy(
  () => import('modules/insight/PageCoinDetails'),
);

const PageTechnicalRadar = React.lazy(
  () => import('modules/insight/PageTechnicalRadar'),
);

const PageWhaleRadar = React.lazy(
  () => import('modules/insight/PageWhaleRadar'),
);

const PageWhaleDetails = React.lazy(
  () => import('modules/insight/PageWhaleDetails'),
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
          element: <PageCoinRadar />,
        },
        {
          path: 'social-radar',
          handle: { crumb: t('menu.hot-coins.title') },
          element: <PageSocialRadar />,
        },
        {
          path: 'technical-radar',
          element: <PageTechnicalRadar />,
          handle: { crumb: t('menu.ai-indicators.title') },
        },
        {
          path: 'whale-radar',
          handle: { crumb: t('menu.whales.title') },
          children: [
            {
              path: '',
              element: <PageWhaleRadar />,
            },
            {
              path: ':network/:address',
              element: <PageWhaleDetails />,
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
          element: <PageCoinDetails />,
          handle: { crumb: (p: Params<string>) => p.slug },
        },
      ],
    },
  ] satisfies RouteObject[];
};

export default useInsightRoutes;
