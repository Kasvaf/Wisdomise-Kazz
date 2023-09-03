import * as React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import PageWrapper from './PageWrapper';
import Container from './Container';

const PageSignalsMatrix = React.lazy(
  () => import('modules/products/PageSignalsMatrix'),
);

const PageProductsCatalog = React.lazy(
  () => import('modules/products/PageProductsCatalog'),
);
const PageProductCatalogDetail = React.lazy(
  () => import('modules/products/PageProductCatalogDetail'),
);

const PageAssetOverview = React.lazy(
  () => import('modules/wallet/PageAssetOverview'),
);

const PageFPIPositions = React.lazy(
  () => import('modules/wallet/PageFPIPositions'),
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
              <PageAssetOverview />
            </React.Suspense>
          }
        />

        <Route
          path="app/fpi/:fpiKey"
          element={
            <React.Suspense fallback={<PageWrapper loading />}>
              <PageFPIPositions />
            </React.Suspense>
          }
        />

        <Route
          path="app/products-catalog"
          element={
            <React.Suspense fallback={<PageWrapper loading />}>
              <PageProductsCatalog />
            </React.Suspense>
          }
        />

        <Route
          path="app/products-catalog/:fpKey"
          element={
            <React.Suspense fallback={<PageWrapper loading />}>
              <PageProductCatalogDetail />
            </React.Suspense>
          }
        />

        <Route
          path="app/signals"
          element={
            <React.Suspense fallback={<PageWrapper loading />}>
              <PageSignalsMatrix />
            </React.Suspense>
          }
        />
      </Route>
    </Routes>
  );
}
