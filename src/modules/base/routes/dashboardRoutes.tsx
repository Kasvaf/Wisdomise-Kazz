import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { Navigate, type RouteObject } from 'react-router-dom';
import Container from '../Container';

const PageHome = React.lazy(() => import('modules/home/PageHome'));

const PageAssetOverview = React.lazy(
  () => import('modules/investment/PageAssetOverview'),
);

const PageFPIPositions = React.lazy(
  () => import('modules/investment/PageFPIPositions'),
);

const useDashboardRoutes = () => {
  const { t } = useTranslation('base');

  return [
    {
      path: 'dashboard',
      element: <Container />,
      children: [
        { path: '', element: <Navigate to="/dashboard/overview" replace /> },
        { path: 'overview', element: <PageHome /> },
        {
          path: 'portfolio',
          handle: { crumb: t('menu.portfolio.title') },
          children: [
            {
              path: '',
              element: <PageAssetOverview />,
            },
            {
              path: ':fpiKey',
              element: <PageFPIPositions />,
              handle: { crumb: t('products:fpi-page.title') },
            },
          ],
        },
      ],
    },
  ] satisfies RouteObject[];
};

export default useDashboardRoutes;
