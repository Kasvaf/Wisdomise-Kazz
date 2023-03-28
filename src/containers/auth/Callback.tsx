import { WISDOMISE_TOKEN_KEY } from "config/constants";
import { FunctionComponent, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useAppDispatch } from "store/store";
import { loadSessionData } from "store/userInfo";

const Callback: FunctionComponent = () => {
  const [searchParams] = useSearchParams();
  const dispatch = useAppDispatch();

  useEffect(() => {
    const token = searchParams.get("token");
    if (token) {
      localStorage.setItem(WISDOMISE_TOKEN_KEY, token);
      setTimeout(() => {
        dispatch(loadSessionData());
      }, 0);
    }
  }, [searchParams, dispatch]);

  return null;
};

export default Callback;
