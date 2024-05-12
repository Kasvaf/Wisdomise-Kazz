import { Navigate, type RouteObject } from 'react-router-dom';
import HomePage from 'modules/home/PageHome';
import Container from '../Container';
import Boundary from './Boundary';
import useAuthRoutes from './authRoutes';
import useInvestmentRoutes from './investmentRoutes';
import useInsightRoutes from './insightRoutes';
import useBuilderRoutes from './builderRoutes';
import useAccountRoutes from './accountRoutes';

const useRoutes = () => {
  const authRoutes = useAuthRoutes();
  const insightRoutes = useInsightRoutes();
  const builderRoutes = useBuilderRoutes();
  const accountRoutes = useAccountRoutes();
  const investmentRoutes = useInvestmentRoutes();

  return [
    {
      element: <Boundary />,
      children: [
        ...authRoutes,
        ...investmentRoutes,
        ...insightRoutes,
        ...builderRoutes,
        ...accountRoutes,
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
