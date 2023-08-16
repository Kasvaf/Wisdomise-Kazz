import type { Middleware } from "@reduxjs/toolkit";
import { isRejectedWithValue } from "@reduxjs/toolkit";
import { notification } from "antd";
import { JwtTokenKey } from "config/constants";

export const rtkQueryErrorMiddleware: Middleware = () => (next) => (action) => {
  // RTK Query uses `createAsyncThunk` from redux-toolkit under the hood,
  // so we're able to utilize these matchers!
  if (isRejectedWithValue(action)) {
    const response = action.meta?.baseQueryMeta?.response;

    if (response?.status === 401 || response?.status === 403) {
      localStorage.removeItem(JwtTokenKey);

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
        case 500: {
          title = "Internal Server Error";
          break;
        }
        default: {
          title = "Unknown Error";
          break;
        }
      }
      notification.error({
        message: title,
        description: body,
      });
    }
  }

  return next(action);
};
