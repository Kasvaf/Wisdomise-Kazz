import { JwtTokenKey } from "config/constants";
import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useAppDispatch } from "store/store";
import { loadSessionData } from "store/userInfo";

export const AuthCallback = () => {
  const dispatch = useAppDispatch();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const token = searchParams.get("token");

    if (token) {
      localStorage.setItem(JwtTokenKey, token);
      setTimeout(() => {
        dispatch(loadSessionData());
      }, 0);
    }
  }, [searchParams, dispatch]);

  return null;
};
