import * as React from "react";
import { useCallback, useEffect, useState } from "react";
import ReactGA from "react-ga4";
import { hotjar } from "react-hotjar";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import "tw-elements";

import ConnectWallet from "containers/connectWallet/ConnectWallet";
import KycPage from "containers/kyc";
import VerificationPage from "containers/kyc/Verification";
import ReferralPage from "containers/referral";
import { horosApi, useGetUserInfoQuery } from "../api/horosApi";
import Congrats from "../containers/congrats";
import Dashboard from "../pages/dashboard/Dashboard";
import { signoutAction } from "../store/slices/signout";
import { useAppDispatch } from "../store/store";

import ConfirmSignUp from "containers/auth/ConfirmSignUp";
import { SecondaryForm } from "containers/SecondaryForm";
import Splash from "containers/splash/Splash";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import "react-notifications/lib/notifications.css";
import { Container } from "../container/Container";
import "./App.css";
import "./tailwind.css";

const Signals = React.lazy(
  () => import("containers/dashboard/components/Signals")
);
const Analytics = React.lazy(
  () => import("containers/dashboard/components/Analytics")
);

const ProductCatalogDetail = React.lazy(
  () => import("pages/productsCatalog/ProductCatalogDetail")
);

const Deposit = React.lazy(() => import("containers/deposit"));
const ProductsCatalog = React.lazy(
  () => import("pages/productsCatalog/ProductsCatalog")
);
const Transaction = React.lazy(() => import("containers/transaction"));
const Withdraw = React.lazy(() => import("containers/withdraw"));

interface Props {
  signOut: () => void;
}

export const App: React.FC<Props> = (props) => {
  const dispatch = useAppDispatch();
  const [signOutInProgress, setSignOutInProgress] = useState(false);
  const { data: userInfo, isSuccess, isLoading } = useGetUserInfoQuery({});

  const triggerSignOut = () => {
    setSignOutInProgress(true);
  };

  const handleSignOut = useCallback(() => {
    dispatch(signoutAction());
    dispatch(horosApi.util.resetApiState());
    props.signOut();
  }, [props.signOut, dispatch]);

  // ** hotjar and GA config
  useEffect(() => {
    if (import.meta.env.VITE_HJID && import.meta.env.VITE_HJSV) {
      hotjar.initialize(import.meta.env.VITE_HJID, import.meta.env.VITE_HJSV);
    }
    if (import.meta.env.VITE_GA) {
      ReactGA.initialize(import.meta.env.VITE_GA);
    }
  }, []);

  useEffect(() => {
    if (!signOutInProgress) return;
    handleSignOut();
  }, [signOutInProgress, handleSignOut]);

  if (isLoading) {
    return <Splash />;
  }

  const hasAcceptedTerms =
    !isSuccess || userInfo?.customer.terms_and_conditions_accepted;
  if (!hasAcceptedTerms) {
    return <SecondaryForm signOut={triggerSignOut} />;
  }

  const notEmailConfirmed =
    isSuccess &&
    userInfo?.customer.user.email &&
    !userInfo?.customer.info.email_verified;

  if (notEmailConfirmed) {
    return <ConfirmSignUp signOut={triggerSignOut} />;
  }

  const Loading = () => <div></div>;

  const dashboardElement = <Dashboard />;

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route element={<Container signOut={triggerSignOut} />}>
            <Route
              path="/"
              element={
                !signOutInProgress ? <Navigate to="/app" /> : <Congrats />
              }
            />
            <Route path="login/:action" element={dashboardElement} />
            <Route path="app" element={<Navigate to="/app/dashboard" />} />
            <Route path="app/:section" element={dashboardElement} />
            <Route path="app/:section/:subsection" element={dashboardElement} />
            <Route path="/auth/callback" element={<Navigate to="/app" />} />

            <Route
              path="app/products-catalog"
              element={
                <React.Suspense fallback={<Loading />}>
                  <ProductsCatalog />
                </React.Suspense>
              }
            />

            <Route
              path="app/products-catalog/:fpKey"
              element={
                <React.Suspense fallback={<Loading />}>
                  <ProductCatalogDetail />
                </React.Suspense>
              }
            />

            <Route
              path="app/referral"
              element={
                <React.Suspense fallback={<Loading />}>
                  <ReferralPage />
                </React.Suspense>
              }
            />
            <Route
              path="app/kyc/verification"
              element={
                <React.Suspense fallback={<Loading />}>
                  <VerificationPage />
                </React.Suspense>
              }
            />
            <Route
              path="app/kyc"
              element={
                <React.Suspense fallback={<Loading />}>
                  <KycPage />
                </React.Suspense>
              }
            />
            <Route
              path="app/signals"
              element={
                <React.Suspense fallback={<Loading />}>
                  <Signals />
                </React.Suspense>
              }
            />

            <Route
              path="app/backtest"
              element={
                <React.Suspense fallback={<Loading />}>
                  <Analytics />
                </React.Suspense>
              }
            />

            <Route
              path="app/withdraw"
              element={
                <React.Suspense fallback={<Loading />}>
                  <Withdraw />
                </React.Suspense>
              }
            />

            <Route
              path="app/deposit/:exchangeAccountKey"
              element={
                <React.Suspense fallback={<Loading />}>
                  <Deposit />
                </React.Suspense>
              }
            />

            <Route
              path="app/connectWallet/:id"
              element={
                <React.Suspense fallback={<Loading />}>
                  <ConnectWallet />
                </React.Suspense>
              }
            />

            <Route
              path="app/transactions"
              element={
                <React.Suspense fallback={<Loading />}>
                  <Transaction />
                </React.Suspense>
              }
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
};
