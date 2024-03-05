/* eslint-disable import/max-dependencies */
import * as React from 'react';
import { type RouteObject } from 'react-router-dom';
import PageInsight from 'modules/insight/PageInsight';
import Container from '../Container';

const PageSignalsMatrix = React.lazy(
  () => import('modules/insight/PageSignalsMatrix'),
);
const PageCoins = React.lazy(
  () => import('modules/insight/signaler/PageCoins'),
);
const PageSignaler = React.lazy(
  () => import('modules/insight/signaler/PageSignaler'),
);

const PageAthena = React.lazy(() => import('modules/athena/PageAthena'));
const PageSocialRadar = React.lazy(
  () => import('modules/insight/PageSocialRadar'),
);
const PageSocialRadarDetail = React.lazy(
  () => import('modules/insight/PageSocialRadarDetail'),
);

const insightRoutes: RouteObject[] = [
  {
    element: <Container />,
    path: 'insight',
    children: [
      { path: '', element: <PageInsight /> },
      { path: 'signals', element: <PageSignalsMatrix /> },
      { path: 'coins', element: <PageCoins /> },
      { path: 'coins/signaler', element: <PageSignaler /> },
      { path: 'athena', element: <PageAthena /> },
      { path: 'social-radar', element: <PageSocialRadar /> },
      { path: 'social-radar/:symbol', element: <PageSocialRadarDetail /> },
    ],
  },
];

export default insightRoutes;
