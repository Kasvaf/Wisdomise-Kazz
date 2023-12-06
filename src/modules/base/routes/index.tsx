import { Navigate, type RouteObject } from 'react-router-dom';
import Boundary from './Boundary';
import authRoutes from './authRoutes';
import accountRoutes from './accountRoutes';
import appRoutes from './appRoutes';

const routes: RouteObject[] = [
  {
    element: <Boundary />,
    children: [
      ...authRoutes,
      ...accountRoutes,
      ...appRoutes,
      { path: '*', element: <Navigate to="/investment/assets" /> },
    ],
  },
];

export default routes;
