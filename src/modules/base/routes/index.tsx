import { Navigate, type RouteObject } from 'react-router-dom';
import Boundary from './Boundary';
import useAuthRoutes from './authRoutes';
import useInvestmentRoutes from './investmentRoutes';
import useInsightRoutes from './insightRoutes';
import useBuilderRoutes from './builderRoutes';
import useAccountRoutes from './accountRoutes';

const useRoutes = () => {
  const authRoutes = useAuthRoutes();
  const investmentRoutes = useInvestmentRoutes();
  const insightRoutes = useInsightRoutes();
  const builderRoutes = useBuilderRoutes();
  const accountRoutes = useAccountRoutes();

  return [
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
  ] satisfies RouteObject[];
};

export default useRoutes;
