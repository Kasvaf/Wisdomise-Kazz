import * as React from "react";
import { useEffect } from "react";
import ReactGA from "react-ga4";
import { hotjar } from "react-hotjar";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import "tw-elements";

import Dashboard from "../pages/dashboard/Dashboard";

import ConfirmSignUp from "containers/auth/ConfirmSignUp";
import { SecondaryForm } from "containers/SecondaryForm";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { PageWrapper } from "shared/components/PageWrapper";
import { Splash } from "shared/components/Splash";
import { useUserInfoQuery } from "shared/services/services";
import { Container } from "../container/Container";
import "./App.css";
import "./tailwind.css";

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
const Signals = React.lazy(() => import("pages/signals/Signals"));
const Withdraw = React.lazy(() => import("pages/withdraw/Withdraw"));

export const App = () => {
  const { data: userInfo, isSuccess, isLoading } = useUserInfoQuery();

  // ** hotjar and GA config
  useEffect(() => {
    if (import.meta.env.VITE_HJID && import.meta.env.VITE_HJSV) {
      hotjar.initialize(import.meta.env.VITE_HJID, import.meta.env.VITE_HJSV);
    }
    if (import.meta.env.VITE_GA) {
      ReactGA.initialize(import.meta.env.VITE_GA);
    }
  }, []);

  if (isLoading) {
    return <Splash />;
  }

  const hasAcceptedTerms =
    !isSuccess || userInfo?.customer.terms_and_conditions_accepted;
  if (!hasAcceptedTerms) {
    return <SecondaryForm />;
  }

  const notEmailConfirmed =
    isSuccess &&
    userInfo?.customer.user.email &&
    !userInfo?.customer.info.email_verified;

  if (notEmailConfirmed) {
    return <ConfirmSignUp />;
  }

  const dashboardElement = <Dashboard />;

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
                  <ProductsCatalog />
                </React.Suspense>
              }
            />

            <Route
              path="app/products-catalog/:fpKey"
              element={
                <React.Suspense fallback={<PageWrapper loading />}>
                  <ProductCatalogDetail />
                </React.Suspense>
              }
            />

            <Route
              path="app/signals"
              element={
                <React.Suspense fallback={<PageWrapper loading />}>
                  <Signals />
                </React.Suspense>
              }
            />

            <Route
              path="app/backtest"
              element={
                <React.Suspense fallback={<PageWrapper loading />}>
                  <Analytics />
                </React.Suspense>
              }
            />

            <Route
              path="app/withdraw"
              element={
                <React.Suspense fallback={<PageWrapper loading />}>
                  <Withdraw />
                </React.Suspense>
              }
            />

            <Route
              path="app/deposit/:exchangeAccountKey"
              element={
                <React.Suspense fallback={<PageWrapper loading />}>
                  <Deposit />
                </React.Suspense>
              }
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
};
