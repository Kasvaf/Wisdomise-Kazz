import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { JwtTokenKey } from "config/constants";

export const AuthCallback = () => {
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const token = searchParams.get("token");
    if (token) {
      localStorage.setItem(JwtTokenKey, JSON.stringify(token));
    }
  }, [searchParams]);

  return null;
};
