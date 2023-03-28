import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import App from "./App";
import store from "./store/store";
import { withLDProvider } from "launchdarkly-react-client-sdk";
import * as Sentry from "@sentry/react";
import { BrowserTracing } from "@sentry/tracing";

const isLocal = window.location.hostname.includes("localhost");

if (!isLocal) {
  Sentry.init({
    dsn: "https://ee6306165f3f4aef867f1fa37bcbf494@sentry.wisdomise.io/9",
    integrations: [new BrowserTracing()],

    // We recommend adjusting this value in production, or using tracesSampler
    // for finer control
    tracesSampleRate: 1.0,
  });
}

function FallbackComponent() {
  return <div>An error has occurred</div>;
}

const myFallback = <FallbackComponent />;

const LDProvider = withLDProvider({
  clientSideID: "640595d0b3b886134be7a9fc",
  context: {
    kind: "qa",
    key: "qa",
    name: "qa",
    email: ["farzaneh@wisdomise.io", "ali.ghafoori@wisdomise.io"],
  },
  options: {
    /* ... */
  },
})(App);

const targetRootNode = document.getElementById("root");
if (!targetRootNode) {
  throw new Error("Can not find root dom element.");
}
const root = ReactDOM.createRoot(targetRootNode);

root.render(
  <Sentry.ErrorBoundary fallback={myFallback} showDialog>
    <Provider store={store}>
      <LDProvider />
    </Provider>
  </Sentry.ErrorBoundary>
);
