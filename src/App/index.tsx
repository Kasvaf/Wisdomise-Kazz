/// <reference types="vite-plugin-svgr/client" />
import * as React from "react";
import { useCallback, useEffect, useState, FunctionComponent } from "react";
import { NotificationContainer } from "react-notifications";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "tw-elements";
import { hotjar } from "react-hotjar";
import ReactGA from "react-ga4";

import { loadSessionData } from "../store/userInfo";
import Congrats from "../containers/congrats";
import Dashboard from "../containers/dashboard/Dashboard";
import AuthContainer from "containers/auth/AuthContainer";
import { horosApi, useGetUserInfoQuery } from "../api/horosApi";
import { useAppDispatch, useAppSelector } from "../store/store";
import { signoutAction } from "../store/slices/signout";
import Callback from "containers/auth/Callback";
import { WISDOMISE_TOKEN_KEY } from "config/constants";
import DB from "config/keys";
import HomeLayout from "components/Layout";
import ConnectWallet from "containers/connectWallet/ConnectWallet";
import KycPage from "containers/kyc";
import VerificationPage from "containers/kyc/Verification";
import ReferralPage from "containers/referral";
import Policy from "containers/Policy";
import Terms from "containers/Terms";
import { RootState } from "../store/appReducer";

import "antd/dist/antd.css";
import "react-notifications/lib/notifications.css";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import "./tailwind.css";
import "./App.css";
import ConfirmSignUp from "containers/auth/ConfirmSignUp";
import SecondaryForm from "containers/SecondaryForm";

const Signals = React.lazy(
  () => import("containers/dashboard/components/Signals")
);
const Analytics = React.lazy(
  () => import("containers/dashboard/components/Analytics")
);
const RiskDetail = React.lazy(() => import("containers/risks"));
const Deposit = React.lazy(() => import("containers/deposit"));
const Catalog = React.lazy(() => import("containers/catalog"));
const Transaction = React.lazy(() => import("containers/transaction"));
const Withdraw = React.lazy(() => import("containers/withdraw"));

function AppAuthenticationContainer() {
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(loadSessionData());
  }, [dispatch]);

  const signOut = useCallback(async () => {
    localStorage.removeItem(WISDOMISE_TOKEN_KEY);
    window.location.href = `${DB}/api/v1/account/logout`;
  }, []);

  const sessionData = useAppSelector((state: RootState) => state.user);
  const isAuthenticated = sessionData?.jwtToken;
  const isLoading = sessionData?.loading;

  if (isLoading) {
    return null;
  }
  return (
    <>
      {!isAuthenticated ? (
        <BrowserRouter>
          <Routes>
            <Route path="/auth/callback" element={<Callback />} />
            <Route path="/*" element={<AuthContainer />} />
            <Route path="/policy" element={<Policy />} />
          </Routes>
        </BrowserRouter>
      ) : (
        <App signOut={signOut} />
      )}
      <NotificationContainer />
    </>
  );
}
interface AppProps {
  signOut: () => void;
}

const App: FunctionComponent<AppProps> = (props) => {
  const dispatch = useAppDispatch();

  const handleSignOut = useCallback(() => {
    dispatch(signoutAction());
    dispatch(horosApi.util.resetApiState());
    props.signOut();
  }, [props.signOut, dispatch]);

  const [signOutInProgress, setSignOutInProgress] = useState(false);

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

  const triggerSignOut = () => {
    setSignOutInProgress(true);
  };

  const { data: userInfo, isSuccess } = useGetUserInfoQuery({});
  const hasAcceptedTerms =
    isSuccess && userInfo.customer.terms_and_conditions_accepted;
  if (!hasAcceptedTerms) {
    return <SecondaryForm />;
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
          <Route path="/policy" element={<Policy />} />
          <Route path="/terms" element={<Terms />} />
          <Route element={<HomeLayout signOut={triggerSignOut} />}>
            <Route
              path="/"
              element={
                !signOutInProgress ? <Navigate to="/app" /> : <Congrats />
              }
            />
            <Route path="login/:action" element={dashboardElement} />
            <Route path="app" element={dashboardElement} />
            <Route path="app/:section" element={dashboardElement} />
            <Route path="app/:section/:subsection" element={dashboardElement} />
            <Route path="/auth/callback" element={<Navigate to="/app" />} />

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
              path="app/strategyCatalog/:id"
              element={
                <React.Suspense fallback={<Loading />}>
                  <RiskDetail />
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
              path="app/strategyCatalog"
              element={
                <React.Suspense fallback={<Loading />}>
                  <Catalog />
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

export default AppAuthenticationContainer;
