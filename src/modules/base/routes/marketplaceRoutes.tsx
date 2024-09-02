import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { Navigate, type RouteObject } from 'react-router-dom';
import Container from '../Container';
import useBuilderRoutes from './builderRoutes';

const PageMarketplaceOverview = React.lazy(
  () => import('modules/investment/PageMarketplaceOverview'),
);
const PageSignalersOverview = React.lazy(
  () => import('modules/insight/signaler/PageSignalersOverview'),
);
const PageCoins = React.lazy(
  () => import('modules/insight/signaler/PageCoins'),
);
const PageSignaler = React.lazy(
  () => import('modules/insight/signaler/PageSignaler'),
);

const PageProductsCatalog = React.lazy(
  () => import('modules/investment/PageProductsCatalog'),
);
const PageProductCatalogDetail = React.lazy(
  () => import('modules/investment/PageProductCatalogDetail'),
);

const PageProtocolDetails = React.lazy(
  () => import('modules/investment/PageProtocolDetails'),
);

const useMarketplaceRoutes = () => {
  const { t } = useTranslation('base');
  return [
    {
      element: <Container />,
      path: 'marketplace',
      handle: { crumb: t('menu.investment.title') },
      children: [
        { path: '', element: <Navigate to="/marketplace/overview" replace /> },
        { path: 'overview', element: <PageMarketplaceOverview /> },

        {
          path: 'signalers',
          element: <PageSignalersOverview />,
          handle: { crumb: t('menu.signalers.title') },
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
          path: 'products-catalog',
          handle: { crumb: t('menu.financial-products.title') },
          children: [
            {
              path: '',
              element: <PageProductsCatalog />,
            },
            {
              path: 'fp/:fpKey',
              element: <PageProductCatalogDetail />,
              handle: { crumb: t('products:product-detail.type.trade') },
            },
            {
              path: 'stake/:id',
              element: <PageProtocolDetails />,
              handle: { crumb: t('products:product-detail.type.stake') },
            },
          ],
        },
        ...useBuilderRoutes(),
      ],
    },
  ] satisfies RouteObject[];
};

export default useMarketplaceRoutes;
