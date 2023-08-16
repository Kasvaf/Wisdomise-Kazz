import { DB } from "./keys";

export const JwtTokenKey = "TOKEN";
export const LoginUrl = `${DB}/api/v1/account/login`;

export const ANALYTICS_ERRORS = {
  aat: {
    dateRange: {
      invalid: "Start date must be greater than end date",
    },
  },
  spo: {
    dateRange: {
      invalid: "Start date must be greater than end date",
    },
  },
};
