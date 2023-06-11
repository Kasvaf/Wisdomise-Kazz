import { withLDProvider } from "launchdarkly-react-client-sdk";
import { AppAuthContainer } from "../App/AppAuthContainer";

export const LDProvider = withLDProvider({
  clientSideID: "640595d0b3b886134be7a9fc",
  context: {
    kind: "qa",
    key: "qa",
    name: "qa",
    email: ["farzaneh@wisdomise.io", "ali.ghafoori@wisdomise.io"],
  },
  options: {},
})(AppAuthContainer);
