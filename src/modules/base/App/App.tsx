import { useEffect } from 'react';
import ReactGA from 'react-ga4';
import { hotjar } from 'react-hotjar';
import { BrowserRouter } from 'react-router-dom';
import 'tw-elements';

import ConfirmSignUp from 'modules/auth/ConfirmSignUp';
import { SecondaryForm } from 'modules/auth/SecondaryForm';
import { useInvestorAssetStructuresQuery, useUserInfoQuery } from 'api';
import { Splash } from '../Splash';
import './App.css';
import './tailwind.css';
import AppRoutes from './AppRoutes';

export const App = () => {
  const userInfo = useUserInfoQuery();
  const ias = useInvestorAssetStructuresQuery();

  // ** hotjar and GA config
  useEffect(() => {
    if (import.meta.env.VITE_HJID && import.meta.env.VITE_HJSV) {
      hotjar.initialize(import.meta.env.VITE_HJID, import.meta.env.VITE_HJSV);
    }
    if (import.meta.env.VITE_GA) {
      ReactGA.initialize(import.meta.env.VITE_GA);
    }
  }, []);

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
