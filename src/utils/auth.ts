import { JwtTokenKey } from "config/constants";
import { DB } from "config/keys";

export const logout = () => {
  localStorage.removeItem(JwtTokenKey);
  window.location.href = `${DB}/api/v1/account/logout`;
};
