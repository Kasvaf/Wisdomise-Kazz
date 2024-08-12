import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { type RouteObject } from 'react-router-dom';
import PageBuilder from 'modules/builder/PageBuilder';

const PageSignalersList = React.lazy(
  () => import('modules/builder/signaler/PageSignalersList'),
);
const PageSignalerCreate = React.lazy(
  () => import('modules/builder/signaler/PageSignalerCreate'),
);
const PageSignalerDetails = React.lazy(
  () => import('modules/builder/signaler/PageSignalerDetails'),
);

const PageFpList = React.lazy(() => import('modules/builder/fp/PageFpList'));
const PageFpCreate = React.lazy(
  () => import('modules/builder/fp/PageFpCreate'),
);
const PageFpDetails = React.lazy(
  () => import('modules/builder/fp/PageFpDetails'),
);

const useBuilderRoutes = () => {
  const { t } = useTranslation('base');
  return [
    {
      // element: <Container />,
      path: 'builder',
      handle: { crumb: t('menu.builder.title') },
      children: [
        { path: '', element: <PageBuilder /> },
        {
          path: 'signalers',
          handle: { crumb: t('menu.signal-builder.title') },
          children: [
            {
              path: '',
              element: <PageSignalersList />,
            },
            {
              path: 'new',
              element: <PageSignalerCreate />,
              handle: { crumb: 'New Signaler' },
            },
            {
              path: ':id',
              element: <PageSignalerDetails />,
              handle: { crumb: 'Signaler' },
            },
          ],
        },
        {
          path: 'fp',
          handle: { crumb: t('menu.fp-builder.title') },
          children: [
            { path: '', element: <PageFpList /> },
            {
              path: 'new',
              element: <PageFpCreate />,
              handle: { crumb: 'New Product' },
            },
            {
              path: ':id',
              element: <PageFpDetails />,
              handle: { crumb: 'Product' },
            },
          ],
        },
      ],
    },
  ] satisfies RouteObject[];
};

export default useBuilderRoutes;
