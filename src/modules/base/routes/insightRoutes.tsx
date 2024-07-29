/* eslint-disable import/max-dependencies */
import * as React from 'react';
import { type Params, type RouteObject } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import PageInsight from 'modules/insight/PageInsight';
import Container from '../Container';

const PageSignalsMatrix = React.lazy(
  () => import('modules/insight/PageSignalsMatrix'),
);
const PageSignalersOverview = React.lazy(
  () => import('modules/insight/signaler/PageSignalersOverview'),
);
const PageMarketplace = React.lazy(
  () => import('modules/insight/PageMarketplace'),
);
const PageCoins = React.lazy(
  () => import('modules/insight/signaler/PageCoins'),
);
const PageSignaler = React.lazy(
  () => import('modules/insight/signaler/PageSignaler'),
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

const useInsightRoutes = () => {
  const { t } = useTranslation('base');
  return [
    {
      element: <Container />,
      path: 'insight',
      handle: { crumb: t('menu.insight.title') },
      children: [
        { path: '', element: <PageInsight /> },
        {
          path: 'signalers',
          element: <PageSignalersOverview />,
          handle: { crumb: t('menu.signalers.title') },
        },
        {
          path: 'signals',
          element: <PageSignalsMatrix />,
          handle: { crumb: t('menu.signal-matrix.title') },
        },
        {
          path: 'marketplace',
          element: <PageMarketplace />,
          handle: { crumb: t('menu.marketplace.title') },
        },
        {
          path: 'coins',
          handle: { crumb: t('menu.coin-view.title') },
          children: [
            {
              path: '',
              element: <PageCoins />,
            },
            {
              path: 'signaler',
              element: <PageSignaler />,
              handle: { crumb: t('strategy:signaler.info.strategy.label') },
            },
          ],
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
      ],
    },
  ] satisfies RouteObject[];
};

export default useInsightRoutes;
