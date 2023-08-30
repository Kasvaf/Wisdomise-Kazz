import { BrowserRouter } from 'react-router-dom';
import 'tw-elements';

import { useInvestorAssetStructuresQuery, useUserInfoQuery } from 'api';
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

  return (
    <>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </>
  );
};

export default App;
