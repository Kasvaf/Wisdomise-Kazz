import {
  createBrowserRouter,
  createHashRouter,
  RouterProvider,
} from 'react-router-dom';
import { useInvestorAssetStructuresQuery, useUserInfoQuery } from 'api';
import { RouterBaseName } from 'config/constants';
import 'tw-elements';
import routes from './routes';
import Splash from './Splash';
import useAnalytics from './useAnalytics';
import './styles/App.css';

const App = () => {
  useAnalytics();
  const userInfo = useUserInfoQuery();
  const ias = useInvestorAssetStructuresQuery();

  if (userInfo.isLoading || ias.isLoading) {
    return <Splash />;
  }

  const createRouter = RouterBaseName ? createHashRouter : createBrowserRouter;
  return <RouterProvider router={createRouter(routes)} />;
};

export default App;
