import { Navigate, type RouteObject } from 'react-router-dom';
import HomePage from 'modules/home/PageHome';
import Container from '../Container';
import Boundary from './Boundary';
import useAuthRoutes from './authRoutes';
import useInvestmentRoutes from './investmentRoutes';
import useInsightRoutes from './insightRoutes';
import useBuilderRoutes from './builderRoutes';
import useAccountRoutes from './accountRoutes';
import useUsersRoutes from './usersRoutes';

const useRoutes = () => {
  const authRoutes = useAuthRoutes();
  const insightRoutes = useInsightRoutes();
  const builderRoutes = useBuilderRoutes();
  const accountRoutes = useAccountRoutes();
  const investmentRoutes = useInvestmentRoutes();
  const usersRoutes = useUsersRoutes();

  return [
    {
      element: <Boundary />,
      children: [
        ...authRoutes,
        ...investmentRoutes,
        ...insightRoutes,
        ...builderRoutes,
        ...accountRoutes,
        ...usersRoutes,
        {
          path: 'home',
          element: <Container />,
          children: [{ path: '', element: <HomePage /> }],
        },
        { path: '*', element: <Navigate to="/home" /> },
      ],
    },
  ] satisfies RouteObject[];
};

export default useRoutes;
