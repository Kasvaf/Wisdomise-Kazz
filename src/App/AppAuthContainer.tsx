import { useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import { RootState } from "../store/appReducer";
import { useAppDispatch, useAppSelector } from "../store/store";
import { loadSessionData } from "../store/userInfo";

import { LoginUrl } from "config/constants";
import { App } from "./App";
import { AuthCallback } from "./AuthCallback";

export function AppAuthContainer() {
  const dispatch = useAppDispatch();
  const sessionData = useAppSelector((state: RootState) => state.user);

  useEffect(() => {
    dispatch(loadSessionData());
  }, [dispatch]);

  if (sessionData?.loading) {
    return null;
  }

  return (
    <>
      {!sessionData?.jwtToken ? (
        <BrowserRouter>
          <Routes>
            <Route path="/auth/callback" element={<AuthCallback />} />
            <Route
              path="*"
              Component={() => {
                window.location.href = LoginUrl;
                return null;
              }}
            />
          </Routes>
        </BrowserRouter>
      ) : (
        <App />
      )}
    </>
  );
}
