import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { Navigate, type RouteObject } from 'react-router-dom';
import PageInvestment from 'modules/investment/PageInvestment';
import Container from '../Container';
import useBuilderRoutes from './builderRoutes';

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
      handle: { crumb: t('menu.marketplace.title') },
      children: [
        { path: '', element: <Navigate to="/marketplace/overview" /> },
        { path: 'overview', element: <PageInvestment /> },
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
