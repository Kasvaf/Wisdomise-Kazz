import * as React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import PageWrapper from './PageWrapper';
import Container from './Container';

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

const FPIPositionsPage = React.lazy(
  () => import('modules/wallet/FPIPositionsPage'),
);

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<Container />}>
        <Route path="*" element={<Navigate to="/app/assets" />} />

        <Route
          path="app/assets"
          element={
            <React.Suspense fallback={<PageWrapper loading />}>
              <AssetOverviewPage />
            </React.Suspense>
          }
        />

        <Route
          path="app/fpi/:fpiKey"
          element={
            <React.Suspense fallback={<PageWrapper loading />}>
              <FPIPositionsPage />
            </React.Suspense>
          }
        />

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
      </Route>
    </Routes>
  );
}
