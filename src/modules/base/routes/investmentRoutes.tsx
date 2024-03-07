import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { type RouteObject } from 'react-router-dom';
import PageInvestment from 'modules/investment/PageInvestment';
import Container from '../Container';

const PageAssetOverview = React.lazy(
  () => import('modules/investment/PageAssetOverview'),
);

const PageProductsCatalog = React.lazy(
  () => import('modules/investment/PageProductsCatalog'),
);
const PageProductCatalogDetail = React.lazy(
  () => import('modules/investment/PageProductCatalogDetail'),
);

const PageFPIPositions = React.lazy(
  () => import('modules/investment/PageFPIPositions'),
);

const PageProtocolDetails = React.lazy(
  () => import('modules/investment/PageProtocolDetails'),
);

const useInvestmentRoutes = () => {
  const { t } = useTranslation('base');
  return [
    {
      element: <Container />,
      path: 'investment',
      handle: { crumb: t('menu.investment.title') },
      children: [
        { path: '', element: <PageInvestment /> },
        {
          path: 'assets',
          handle: { crumb: t('menu.asset-overview.title') },
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
      ],
    },
  ] satisfies RouteObject[];
};

export default useInvestmentRoutes;
