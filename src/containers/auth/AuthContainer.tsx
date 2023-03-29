import DB from "config/keys";
import { FunctionComponent, useEffect } from "react";

const AuthContainer: FunctionComponent = () => {
  useEffect(() => {
    window.location.href = `${DB}/api/v1/account/login`;
  }, []);
  return null;
};

export default AuthContainer;
