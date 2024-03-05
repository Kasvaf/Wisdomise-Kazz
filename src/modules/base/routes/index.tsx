import { Navigate, type RouteObject } from 'react-router-dom';
import Boundary from './Boundary';
import authRoutes from './authRoutes';
import accountRoutes from './accountRoutes';
import builderRoutes from './builderRoutes';
import investmentRoutes from './investmentRoutes';
import insightRoutes from './insightRoutes';

const routes: RouteObject[] = [
  {
    element: <Boundary />,
    children: [
      ...authRoutes,
      ...investmentRoutes,
      ...insightRoutes,
      ...builderRoutes,
      ...accountRoutes,
      { path: '*', element: <Navigate to="/investment" /> },
    ],
  },
];

export default routes;
