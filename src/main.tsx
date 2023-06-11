import * as Sentry from "@sentry/react";
import { QueryClientProvider } from "@tanstack/react-query";
import "config/config";
import { configApp } from "config/config";
import { LDProvider } from "config/lunchdarkly";
import { queryClient } from "config/reactQuery";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import store from "./store/store";

configApp();

function FallbackComponent() {
  return <div>An error has occurred</div>;
}

ReactDOM.createRoot(document.querySelector("#root")!).render(
  <Sentry.ErrorBoundary fallback={<FallbackComponent />} showDialog>
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <LDProvider />
      </Provider>
    </QueryClientProvider>
  </Sentry.ErrorBoundary>
);
