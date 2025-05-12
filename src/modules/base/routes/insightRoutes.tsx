import * as React from 'react';
import { type Params, type RouteObject } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import PageHome from 'modules/insight/PageHome';
import PageSocialRadar from 'modules/insight/PageSocialRadar';
import PageTechnicalRadar from 'modules/insight/PageTechnicalRadar';
import PageNetworkRadar from 'modules/insight/PageNetworkRadar';
import PageWhaleRadar from 'modules/insight/PageWhaleRadar';
import PageCoinDetails from 'modules/insight/PageCoinDetails';
import PageRedirect from '../PageRedirect';
import Container from '../Container';

const PageOnboarding = React.lazy(
  () => import('modules/insight/PageOnboarding'),
);

const PageWhaleDetails = React.lazy(
  () => import('modules/insight/PageWhaleDetails'),
);

const useInsightRoutes = () => {
  const { t } = useTranslation('base');
  return [
    {
      path: 'coin-radar/onboarding',
      element: <PageOnboarding />,
    },
    {
      element: <Container />,
      path: 'coin-radar',
      children: [
        { path: '', element: <PageRedirect /> },
        {
          path: 'overview',
          element: <PageHome />,
        },
        {
          path: 'social-radar',
          element: <PageSocialRadar />,
        },
        {
          path: 'technical-radar',
          element: <PageTechnicalRadar />,
        },
        {
          path: 'network-radar',
          handle: { crumb: t('menu.trench.title') },
          element: <PageNetworkRadar />,
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
            },
          ],
        },
      ],
    },
    {
      path: 'coin',
      element: <Container />,
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
