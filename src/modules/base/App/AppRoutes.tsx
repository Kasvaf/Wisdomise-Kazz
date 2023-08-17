import * as React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import DashboardPage from 'modules/wallet/DashboardPage';
import { PageWrapper } from '../PageWrapper';
import { Container } from '../layout/Container';

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

export default function AppRoutes() {
  const dashboardElement = <DashboardPage />;

  return (
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
      </Route>
    </Routes>
  );
}
