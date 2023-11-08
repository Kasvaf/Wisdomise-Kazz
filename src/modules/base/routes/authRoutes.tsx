import * as React from 'react';
import { Navigate, type RouteObject } from 'react-router-dom';

const PageConfirmSignUp = React.lazy(
  () => import('modules/auth/PageConfirmSignUp'),
);
const PageSecondaryForm = React.lazy(
  () => import('modules/auth/PageSecondaryForm'),
);
const PageAuthCallback = React.lazy(
  () => import('modules/auth/PageAuthCallback'),
);
const PageLogin = React.lazy(() => import('modules/auth/PageLogin'));
const PageLogout = React.lazy(() => import('modules/auth/PageLogout'));

const defaultNav = '/app/assets';
const authRoutes: RouteObject[] = [
  {
    path: 'auth',
    children: [
      { path: 'callback', element: <PageAuthCallback /> },
      { path: 'login', element: <PageLogin /> },
      { path: 'logout', element: <PageLogout /> },
      { path: 'verify-email', element: <PageConfirmSignUp /> },
      { path: 'secondary-signup', element: <PageSecondaryForm /> },
      { path: '', element: <Navigate to={defaultNav} /> },
    ],
  },
];

export default authRoutes;
