import { BrowserRouter } from 'react-router-dom';
import 'tw-elements';

import { useInvestorAssetStructuresQuery, useUserInfoQuery } from 'api';
import ConfirmSignUp from 'modules/auth/ConfirmSignUp';
import SecondaryForm from 'modules/auth/SecondaryForm';
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

  const hasAcceptedTerms =
    !userInfo.isSuccess ||
    userInfo.data?.customer.terms_and_conditions_accepted;
  if (!hasAcceptedTerms) {
    return <SecondaryForm />;
  }

  const notEmailConfirmed =
    userInfo.isSuccess &&
    userInfo.data?.customer.user.email &&
    !userInfo.data?.customer.info.email_verified;
  if (notEmailConfirmed) {
    return <ConfirmSignUp />;
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
