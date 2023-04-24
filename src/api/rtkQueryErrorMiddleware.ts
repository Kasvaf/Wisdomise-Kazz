import { isRejectedWithValue } from "@reduxjs/toolkit";
import type { Middleware } from "@reduxjs/toolkit";
import { NotificationManager } from "react-notifications";
import { WISDOMISE_TOKEN_KEY } from "config/constants";
import { TOAST_TIME } from "components/constants";

export const rtkQueryErrorMiddleware: Middleware = () => (next) => (action) => {
  // RTK Query uses `createAsyncThunk` from redux-toolkit under the hood,
  // so we're able to utilize these matchers!
  if (isRejectedWithValue(action)) {
    // const request = action.meta?.baseQueryMeta?.request;
    // const tokenOnRequest = request?.headers?.get("authenticaton");
    const response = action.meta?.baseQueryMeta?.response;
    // const endpoint = action.meta?.arg?.endpointName;

    // handle on base query

    if (response?.status === 401 || response?.status === 403) {
      localStorage.removeItem(WISDOMISE_TOKEN_KEY);

      window.location.reload();
    } else {
      let title = "";
      let body = "";
      switch (action?.payload.status) {
        case 400: {
          title = "Validation Error";
          body = JSON.stringify(action?.payload?.data);

          break;
        }
        case 417: {
          title = action?.payload?.data.message;
          body = JSON.stringify(action?.payload?.data.data);

          break;
        }
        default: {
          title = "Internal server Error";
        }
      }
      NotificationManager.error(body, title, TOAST_TIME);
    }
  }

  return next(action);
};
