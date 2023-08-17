import * as React from 'react';
import { useEffect } from 'react';
import ReactGA from 'react-ga4';
import { hotjar } from 'react-hotjar';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import 'tw-elements';

import DashboardPage from 'modules/wallet/DashboardPage';

import ConfirmSignUp from 'modules/auth/ConfirmSignUp';
import { SecondaryForm } from 'modules/auth/SecondaryForm';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import { useInvestorAssetStructuresQuery, useUserInfoQuery } from 'api';
import { PageWrapper } from '../PageWrapper';
import { Splash } from '../Splash';
import { Container } from '../layout/Container';
import './App.css';
import './tailwind.css';

const SignalsMatrixPage = React.lazy(
  () => import('modules/products/SignalsMatrixPage'),
);

const ProductsCatalogPage = React.lazy(
  () => import('modules/products/ProductsCatalogPage'),
);
const ProductCatalogDetailPage = React.lazy(
  () => import('modules/products/ProductCatalogDetailPage'),
);

const AssetOverviewPage = React.lazy(
  () => import('modules/wallet/AssetOverviewPage'),
);
const WithdrawPage = React.lazy(() => import('modules/wallet/WithdrawPage'));
const DepositPage = React.lazy(() => import('modules/wallet/DepositPage'));

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

  const dashboardElement = <DashboardPage />;

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route element={<Container />}>
            <Route path="/" element={<Navigate to="/app" />} />
            <Route path="login/:action" element={dashboardElement} />
            <Route path="app" element={<Navigate to="/app/dashboard" />} />
            <Route path="app/:section" element={dashboardElement} />
            <Route path="app/:section/:subsection" element={dashboardElement} />
            <Route path="/auth/callback" element={<Navigate to="/app" />} />

            <Route
              path="app/products-catalog"
              element={
                <React.Suspense fallback={<PageWrapper loading />}>
                  <ProductsCatalogPage />
                </React.Suspense>
              }
            />

            <Route
              path="app/products-catalog/:fpKey"
              element={
                <React.Suspense fallback={<PageWrapper loading />}>
                  <ProductCatalogDetailPage />
                </React.Suspense>
              }
            />

            <Route
              path="app/signals"
              element={
                <React.Suspense fallback={<PageWrapper loading />}>
                  <SignalsMatrixPage />
                </React.Suspense>
              }
            />

            <Route
              path="app/withdraw"
              element={
                <React.Suspense fallback={<PageWrapper loading />}>
                  <WithdrawPage />
                </React.Suspense>
              }
            />

            <Route
              path="app/asset-overview"
              element={
                <React.Suspense fallback={<PageWrapper loading />}>
                  <AssetOverviewPage />
                </React.Suspense>
              }
            />

            <Route
              path="app/deposit/:exchangeAccountKey"
              element={
                <React.Suspense fallback={<PageWrapper loading />}>
                  <DepositPage />
                </React.Suspense>
              }
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
};
