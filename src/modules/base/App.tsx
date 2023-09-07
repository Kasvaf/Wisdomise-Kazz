import { HashRouter, BrowserRouter } from 'react-router-dom';
import { useInvestorAssetStructuresQuery, useUserInfoQuery } from 'api';
import { RouterBaseName } from 'config/constants';
import 'tw-elements';
import Splash from './Splash';
import AppRoutes from './AppRoutes';
import useAnalytics from './useAnalytics';
import './styles/App.css';

const App = () => {
  useAnalytics();
  const userInfo = useUserInfoQuery();
  const ias = useInvestorAssetStructuresQuery();

  if (userInfo.isLoading || ias.isLoading) {
    return <Splash />;
  }

  return RouterBaseName ? (
    <HashRouter>
      <AppRoutes />
    </HashRouter>
  ) : (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
};

export default App;
