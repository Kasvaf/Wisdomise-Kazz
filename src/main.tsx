/// <reference types="vite-plugin-svgr/client" />
import * as Sentry from "@sentry/react";
import { QueryClientProvider } from "@tanstack/react-query";
import "config/config";
import { configApp } from "config/config";
import { queryClient } from "config/reactQuery";
import ReactDOM from "react-dom/client";
import * as ReactRedux from "react-redux";
import { AppAuthContainer } from "./App/AppAuthContainer";
import store from "./store/store";

configApp();

ReactDOM.createRoot(document.querySelector("#root")!).render(
  <Sentry.ErrorBoundary fallback={<SentryErrorFallback />}>
    <QueryClientProvider client={queryClient}>
      <ReactRedux.Provider store={store}>
        <AppAuthContainer />
      </ReactRedux.Provider>
    </QueryClientProvider>
  </Sentry.ErrorBoundary>
);

function SentryErrorFallback() {
  return <div className="flex h-screen w-screen items-center justify-center text-white">Error Occurred... Sorry!</div>;
}
