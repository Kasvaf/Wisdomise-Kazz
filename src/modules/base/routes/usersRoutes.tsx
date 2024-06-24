/* eslint-disable import/max-dependencies */
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { type RouteObject } from 'react-router-dom';
import Container from '../Container';

const PageUserProfile = React.lazy(
  () => import('modules/users/PageUserProfile'),
);

const useUsersRoutes = () => {
  const { t } = useTranslation('base');

  return [
    {
      element: <Container />,
      path: 'users',
      handle: { crumb: t('menu.users.title') },
      children: [
        {
          path: ':id',
          element: <PageUserProfile />,
        },
      ],
    },
  ] satisfies RouteObject[];
};

export default useUsersRoutes;
